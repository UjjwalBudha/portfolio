pipeline {
    agent any

    stages {
        stage('Pre Build') {
            steps {
                sh 'ls -ltr'
                // sh 'git branch "main" "https://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@github.com/SUSIGUGH/docker02.git"'
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
