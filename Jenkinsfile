pipeline {
    agent any

    tools {
        // Optional: if you ever want to use Node tool from Jenkins "Tools"
        nodejs 'Node18' 
    }

    environment {
        SONARQUBE_ENV = 'SonarQubeServer'
        NEXUS_URL = '192.168.235.132:8081'
        NEXUS_CREDENTIALS_ID = 'nexus-creds'
        NEXUS_REPO = 'frontend-builds'
    }

    stages {
        stage('Clone') {
            steps {
                echo '🔄 Cloning repository...'
                checkout scm
            }
        }

        stage('Clean') {
            steps {
                echo '🧹 Cleaning previous builds...'
                sh 'rm -rf dist react-build.tar.gz || true'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm dependencies...'
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo '🔧 Building React app...'
                sh 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo '🔍 Running SonarQube scan...'
                withSonarQubeEnv("${SONARQUBE_ENV}") {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            echo "📥 Installing SonarScanner CLI..."
                            npm install --no-save sonar-scanner

                            echo "🚀 Launching SonarScanner..."
                            npx sonar-scanner \
                                -Dsonar.projectKey=frontend-react \
                                -Dsonar.sources=src \
                                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
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

        stage('Upload to Nexus') {
            steps {
                echo '📤 Uploading archive to Nexus...'
                withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDENTIALS_ID}", usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                    sh '''
                        if [ ! -f react-build.tar.gz ]; then
                          echo "❌ Build archive not found!"
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
            echo '✅ Frontend pipeline completed successfully!'
        }
        failure {
            echo '❌ Frontend pipeline failed.'
        }
    }
}
