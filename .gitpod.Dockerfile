FROM gitpod/workspace-full:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN bash -c ". .nvm/nvm.sh && nvm install 16.11.0 && nvm use 16.11.0 && nvm alias default 16.11.0"

RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix

RUN npm i depcheck npm-check-updates -g

RUN brew install vale
