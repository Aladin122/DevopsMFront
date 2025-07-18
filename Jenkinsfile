pipeline {
    agent any

    tools {
        nodejs 'Node18' // Assure-toi que Node18 est bien défini dans Jenkins > Global Tools
    }

    environment {
        SONARQUBE_ENV = 'SonarQubeServer'
        IMAGE_NAME = 'frontend-react'
        DOCKER_TAG = 'latest'
        NEXUS_URL = '192.168.235.132:8081'
        NEXUS_DOCKER_URL = '192.168.235.132:8082'
        NEXUS_DOCKER_REPO = 'docker-releases2'
        NEXUS_DOCKER_CREDS_ID = 'nexus-docker-creds'
        NEXUS_CREDENTIALS_ID = 'nexus-creds'
        NEXUS_REPO = 'frontend-builds'
    }

    stages {
        stage('Clone') {
            steps {
                echo '📥 Cloning repository...'
                checkout scm
            }
        }

        stage('Clean') {
            steps {
                echo '🧹 Cleaning previous build...'
                sh 'rm -rf dist react-build.tar.gz || true'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm dependencies...'
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh "docker build --build-arg VITE_API_URL=http://192.168.235.132:8089 -t ${IMAGE_NAME}:${DOCKER_TAG} ."
            }
        }

        stage('Push Docker Image to Nexus') {
            steps {
                echo '📤 Pushing Docker image to Nexus...'
                withCredentials([usernamePassword(credentialsId: "${NEXUS_DOCKER_CREDS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login ${NEXUS_DOCKER_URL} -u "$DOCKER_USER" --password-stdin
                        docker tag ${IMAGE_NAME}:${DOCKER_TAG} ${NEXUS_DOCKER_URL}/${NEXUS_DOCKER_REPO}/${IMAGE_NAME}:${DOCKER_TAG}
                        docker push ${NEXUS_DOCKER_URL}/${NEXUS_DOCKER_REPO}/${IMAGE_NAME}:${DOCKER_TAG}
                    """
                }
            }
        }

        stage('Archive Build') {
            steps {
                echo '📦 Archiving build folder...'
                sh 'tar -czf react-build.tar.gz dist'
            }
        }

        stage('Upload Archive to Nexus') {
            steps {
                echo '📤 Uploading react-build.tar.gz to Nexus...'
                withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDENTIALS_ID}", usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                    sh '''
                        curl -u $NEXUS_USER:$NEXUS_PASS \
                             --upload-file react-build.tar.gz \
                             $NEXUS_URL/repository/$NEXUS_REPO/react-build.tar.gz
                    '''
                }
            }
        }

        stage('Prepare Docker Network') {
            steps {
                echo '⚙️ Preparing Docker network kaddem-network...'
                sh '''
                  if ! docker network inspect kaddem-network >/dev/null 2>&1; then
                    echo "Creating docker network kaddem-network"
                    docker network create kaddem-network
                  else
                    echo "Docker network kaddem-network already exists"
                  fi
                '''
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                echo '🚀 Deploying frontend container...'
                sh '''
                    docker rm -f frontend-app || true
                    docker-compose pull || true
                    docker-compose up -d
                '''
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
