pipeline {
    agent any

    stages {
        stage('Pre Build') {
            steps {
                sh 'ls -ltr'
                 sh 'git branch "main" "https://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@github.com/UjjwalBudha/portfolio.git"'
            }
        }
        stage ('Build') {
            steps {
            sh 'pwd'
            sh 'touch a.txt'
            sh 'ls -ltr'
            sh 'whoami'
            sh 'sudo docker ps'
            }
        }
    }
}
