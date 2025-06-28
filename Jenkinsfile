pipeline {
    agent any

    tools {
        nodejs 'Node18' // Optional: Jenkins Node.js tool if configured
    }

    environment {
        SONARQUBE_ENV = 'SonarQubeServer'
        NEXUS_URL = 'http://192.168.235.132:8081'
        NEXUS_CREDENTIALS_ID = 'nexus-creds'
        NEXUS_REPO = 'frontend-builds'
        IMAGE_NAME = 'frontend-react'
        DOCKER_TAG = 'latest'
    }

    stages {
        stage('Clone') {
            steps {
                echo ' Cloning repository...'
                checkout scm
            }
        }

        stage('Clean') {
            steps {
                echo 'Cleaning previous builds...'
                sh 'rm -rf dist react-build.tar.gz || true'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo ' Installing npm dependencies...'
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo ' Building React app...'
                sh 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo ' Running SonarQube scan...'
                withSonarQubeEnv("${SONARQUBE_ENV}") {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            export NODE_OPTIONS=--max-old-space-size=2048
                            npm install --no-save sonar-scanner
                            npx sonar-scanner \
                              -Dsonar.projectKey=frontend-react \
                              -Dsonar.sources=src \
                              -Dsonar.host.url=$SONAR_HOST_URL \
                              -Dsonar.login=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Archive Build') {
            steps {
                echo '🗜️ Archiving build output...'
                sh 'tar -czf react-build.tar.gz dist/'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo ' Building Docker image...'
                script {
                    sh "docker build -t ${IMAGE_NAME}:${DOCKER_TAG} ."
                }
            }
        }

        stage('Upload to Nexus') {
            steps {
                echo ' Uploading archive to Nexus...'
                withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDENTIALS_ID}", usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                    sh '''
                        if [ ! -f react-build.tar.gz ]; then
                          echo " Build archive not found!"
                          exit 1
                        fi

                        curl -u $NEXUS_USER:$NEXUS_PASS \
                             --upload-file react-build.tar.gz \
                             $NEXUS_URL/repository/$NEXUS_REPO/react-build.tar.gz
                    '''
                }
            }
        }
    }

    post {
        success {
            echo ' Frontend pipeline completed successfully!'
        }
        failure {
            echo ' Frontend pipeline failed.'
        }
    }
}
