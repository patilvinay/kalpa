FROM ngxtech/ubuntu1804:dind


RUN apt install vim unzip -y
#RUN npm install kalpa@0.1.7 -g
ADD . /home/workdir
WORKDIR /home/workdir
RUN npm link
WORKDIR /home/workdir/examples
RUN kalpa install kalpa-file kalpa-ejs kalpa-execa kalpa-inquirer
RUN kalpa exec.yaml
WORKDIR /home/workdir/examples/api-gen
RUN kalpa main.yml
#RUN npm install kalpa kalpa-execa -g
#RUN npm install kalpa -g

# WORKDIR /home/
# RUN git clone https://github.com/patilvinay/kalpa-execa.git
# WORKDIR /home/kalpa-execa
# RUN npm link

# WORKDIR /home/
# RUN git clone https://github.com/patilvinay/kalpa.git
# WORKDIR /home/kalpa
# RUN git checkout WIP
# RUN npm link
# RUN npm link kalpa-execa

# RUN wget https://raw.githubusercontent.com/patilvinay/kalpa/master/examples/exec.yaml
# RUN kalpa exec.yaml

CMD ["/bin/bash", "-c", "while true; do sleep 30; done;"]
