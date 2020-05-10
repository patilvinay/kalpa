FROM ngxtech/ubuntu1804:dind


RUN apt install vim unzip -y
#RUN npm install kalpa@0.1.7 -g
#RUN npm install kalpa-execa@0.0.0 -g
RUN npm install kalpa kalpa-execa -g
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


WORKDIR /home
RUN wget https://raw.githubusercontent.com/patilvinay/kalpa/master/examples/exec.yaml
RUN kalpa exec.yaml

CMD ["/bin/bash", "-c", "while true; do sleep 30; done;"]
