pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = 'front'
        DOCKER_IMAGE_TAG = 'latest'
        DOCKER_REGISTRY = 'localhost:5000'
        FULL_IMAGE = "${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
        NEXUS_CREDENTIALS_ID = 'nexus-creds'
        NEXUS_URL = 'http://nexusmain:8081'
        NEXUS_REPO = 'frontend-builds'
    }

    stages {
        stage('📦 Checkout Source Code') {
            steps {
                echo "🔄 Checking out the latest source code..."
                checkout scm
            }
        }

        stage('🧼 Clean Previous Build') {
            steps {
                echo "🧹 Cleaning up previous build artifacts..."
                sh 'rm -rf dist react-build.tar.gz || true'
            }
        }

        stage('📥 Install Dependencies') {
            steps {
                echo "📦 Installing npm dependencies..."
                sh 'npm install'
            }
        }

        stage('🛠️ Build React App') {
            steps {
                echo "🔧 Building the React application..."
                sh 'npm run build'
            }
        }

        stage('🔍 SonarQube Analysis') {
            steps {
                echo "🧪 Running SonarQube analysis..."
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        echo "📥 Installing SonarScanner CLI..."
                        npm install --no-save sonar-scanner
                        echo "🚀 Launching SonarScanner..."
                        npx sonar-scanner
                    '''
                }
            }
        }

        stage('📚 Archive Frontend Build') {
            steps {
                echo "🗜️ Archiving build output to react-build.tar.gz..."
                sh 'tar -czf react-build.tar.gz dist/'
            }
        }

        stage('🚀 Upload to Nexus') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: NEXUS_CREDENTIALS_ID,
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {
                    sh '''
                        echo "📤 Uploading archive to Nexus..."

                        if [ ! -f react-build.tar.gz ]; then
                            echo "❌ Error: Archive react-build.tar.gz not found!"
                            exit 1
                        fi

                        curl -u $NEXUS_USER:$NEXUS_PASS \
                             --upload-file react-build.tar.gz \
                             "$NEXUS_URL/repository/$NEXUS_REPO/react-build.tar.gz"
                    '''
                }
            }
        }

        stage('🐳 Build Docker Image') {
            steps {
                echo "🔨 Building Docker image: ${FULL_IMAGE}..."
                sh """
                    docker build --build-arg VITE_API_URL=http://192.168.244.128:8089 -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} .
                    docker tag ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ${FULL_IMAGE}
                """
            }
        }

        stage('📦 Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: NEXUS_CREDENTIALS_ID,
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {
                    sh """
                        echo "🔐 Logging in to Docker registry..."
                        echo "\${NEXUS_PASS}" | docker login ${DOCKER_REGISTRY} -u \${NEXUS_USER} --password-stdin

                        echo "📤 Pushing Docker image to Nexus registry..."
                        docker push ${FULL_IMAGE} || (sleep 5 && docker push ${FULL_IMAGE}) || (sleep 10 && docker push ${FULL_IMAGE})

                        echo "🚪 Logging out from Docker registry..."
                        docker logout ${DOCKER_REGISTRY}
                    """
                }
            }
        }
    }

    post {
        always {
            echo "🧽 Cleaning up Docker images and archive..."
            sh """
                docker rmi ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} || true
                docker rmi ${FULL_IMAGE} || true
                rm -f react-build.tar.gz || true
            """
        }
    }
}
