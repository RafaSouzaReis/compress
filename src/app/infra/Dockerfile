# Usa uma imagem leve do Node.js
FROM node:18-alpine

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Habilita o Corepack para gerenciar a versão do Yarn corretamente
RUN corepack enable

# Copia package.json e yarn.lock da raiz do projeto
COPY package.json yarn.lock ./

# Instala as dependências
RUN yarn install --frozen-lockfile

# Copia o código-fonte do projeto
COPY src/ ./src/

# Faz o build da aplicação
RUN yarn build

# Expõe a porta 3000
EXPOSE 3000

# Comando para rodar o servidor
CMD ["yarn", "start"]
