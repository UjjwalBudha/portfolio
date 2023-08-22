pipeline {
    agent any

    stages {
        stage('Pre Build') {
            steps {
                sh 'ls -ltr'
                 
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
