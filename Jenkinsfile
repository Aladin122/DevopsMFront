pipeline {
    agent any

    environment {
        NEXUS_URL = '192.168.235.132:8081'
        NEXUS_REPO = 'repository/frontend-builds'
        NEXUS_IMAGE_REPO = 'docker-releases2'
        FRONTEND_IMAGE = "192.168.235.132:8082/${NEXUS_IMAGE_REPO}/react-frontend:latest"
    }

    stages {

        stage('Build React App') {
            steps {
                echo '📦 Building React frontend...'
                sh '''
                    npm install
                    npm run build
                    tar -czf react-build.tar.gz dist/
                '''
            }
        }

        stage('Upload Build to Nexus') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'nexus-cred', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                    echo '⬆️ Uploading build to Nexus...'
                    sh """
                        curl -u $NEXUS_USER:$NEXUS_PASS --upload-file react-build.tar.gz $NEXUS_URL/$NEXUS_REPO/react-build.tar.gz
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image for frontend...'
                sh """
                    docker build -t ${FRONTEND_IMAGE} .
                """
            }
        }

        stage('Push Image to Nexus Docker Registry') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'nexus-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login 192.168.235.132:8082 -u "$DOCKER_USER" --password-stdin
                        docker push ${FRONTEND_IMAGE}
                    """
                }
            }
        }

        stage('Deploy Frontend with Docker Compose') {
            steps {
                echo '🚀 Deploying frontend container...'
                sh '''
                    docker rm -f frontend-app || true
                    docker-compose -f docker-compose.front.yml pull || true
                    docker-compose -f docker-compose.front.yml up -d
                '''
            }
        }
    }

    post {
        failure {
            echo '❌ Le pipeline a échoué.'
        }
        success {
            echo '✅ Déploiement terminé avec succès.'
        }
    }
}
