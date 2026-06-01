pipeline {
    agent any

    environment {
        // Basic versioning info
        BUILD_VERSION = "1.0.${BUILD_NUMBER}"
        BRANCH_NAME = "${env.GIT_BRANCH}"
        ARTIFACT_DIR = "dist"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Show Version / Branch') {
            steps {
                echo "==================================="
                echo "Build Version: ${BUILD_VERSION}"
                echo "Branch: ${BRANCH_NAME}"
                echo "Build Number: ${BUILD_NUMBER}"
                echo "==================================="
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies with pdfjs-dist override...'
                sh 'npm install pdfjs-dist@3.11.174 --save-exact --force'
                sh 'npm ci'
            }
            post {
                failure {
                    echo 'Dependency installation failed'
                }
            }
        }
        }"pdfjs-dist": "4.0.379",

        stage('Build Application (ARTIFACT GENERATION)') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Create Build Artifact') {
            steps {
                sh '''
                    echo "Packaging build artifact..."
                    mkdir -p artifact
                    cp -r dist artifact/ || true
                    cp -r build artifact/ || true
                    tar -czf build-${BUILD_VERSION}.tar.gz artifact
                '''
            }
        }

        stage('Tag Build') {
            steps {
                script {
                    sh """
                        git config user.email "jenkins@ci.local"
                        git config user.name "Jenkins CI"

                        git tag -a v${BUILD_VERSION} -m "CI Build ${BUILD_VERSION}"
                        git push origin v${BUILD_VERSION} || true
                    """
                }
            }
        }

        stage('Archive Artifact') {
            steps {
                archiveArtifacts artifacts: "build-${BUILD_VERSION}.tar.gz", fingerprint: true
            }
        }

        stage('Store Artifact Locally') {
            steps {
                sh '''
                    mkdir -p /tmp/jenkins-artifacts
                    cp build-*.tar.gz /tmp/jenkins-artifacts/ || true
                    echo "Stored artifact in local storage"
                '''
            }
        }
    }

    post {
        success {
            echo "BUILD SUCCESS - ${BUILD_VERSION}"
        }
        failure {
            echo "BUILD FAILED"
        }
    }
}