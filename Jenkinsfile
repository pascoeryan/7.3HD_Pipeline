pipeline {
    agent any
    environment {
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
                echo '🔧 Installing dependencies with pdfjs-dist fix...'
                sh 'npm install pdfjs-dist@3.11.174 --save-exact --force'
                sh 'npm ci'
            }
        }
        
        stage('Build Application') {
            steps {
                echo '🏗️ Building Angular application...'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker production image...'
                sh 'docker build -f Dockerfile.prod -t doubtfire-web:${BUILD_VERSION} .'
                sh 'docker tag doubtfire-web:${BUILD_VERSION} doubtfire-web:latest'
             }
        }

        stage('Code Quality - SonarCloud') {
            steps {
                echo '🔍 Running SonarCloud Code Quality Analysis...'
        
                withCredentials([string(credentialsId: 'sonarcloud-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        npx sonarqube-scanner \
                            -Dsonar.organization=pascoeryan \
                            -Dsonar.projectKey=7.3HD_Pipeline \
                            -Dsonar.projectName=7.3HD_Pipeline \
                            -Dsonar.host.url=https://sonarcloud.io \
                            -Dsonar.token=${SONAR_TOKEN} \
                            -Dsonar.exclusions=node_modules/**,dist/**,coverage/**,**/*.spec.ts
                    '''
                }
            }
        }

        stage('Security Scan') {
            steps {
                echo '🔒 Running Security Analysis...'

                // NPM Audit - Force official registry
                sh 'npm config set registry https://registry.npmjs.org/'
                sh 'npm audit --audit-level=moderate > npm-audit-report.txt || echo "Vulnerabilities found (see report)"'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'npm-audit-report.txt', fingerprint: true, allowEmptyArchive: true
                }
                success {
                    echo "✅ Security scan completed"
                }
            }
        }

        stage('Create Build Artifact') {
            steps {
                echo '📦 Creating artifacts...'
                sh 'mkdir -p artifact'
                sh 'cp -r dist artifact/ || true'
                sh 'sudo docker save -o artifact/doubtfire-web-${BUILD_VERSION}.tar doubtfire-web:${BUILD_VERSION}'
                sh 'tar -czf build-${BUILD_VERSION}.tar.gz artifact'
            }
        }
        
        stage('Tag Build') {
            steps {
                script {
                    sh '''
                        git config user.email "jenkins@ci.local"
                        git config user.name "Jenkins CI"
                        git tag -a v${BUILD_VERSION} -m "CI Build ${BUILD_VERSION}" || true
                        git push origin v${BUILD_VERSION} || true
                    '''
                }
            }
        }
        
        stage('Archive Artifact') {
            steps {
                archiveArtifacts artifacts: "build-${BUILD_VERSION}.tar.gz", fingerprint: true
            }
        }
    }
    
    post {
        success {
            echo "✅ BUILD SUCCESS - Version ${BUILD_VERSION}"
        }
        failure {
            echo "❌ BUILD FAILED"
        }
    }
}