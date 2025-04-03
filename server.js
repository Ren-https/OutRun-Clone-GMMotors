const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Função para formatar o tempo
function formatTime(dt) {
  const minutes = Math.floor(dt / 60);
  const seconds = Math.floor(dt - minutes * 60);
  const tenths = Math.floor(10 * (dt - Math.floor(dt)));
  if (minutes > 0)
    return minutes + "." + (seconds < 10 ? "0" : "") + seconds + "." + tenths;
  else
    return seconds + "." + tenths;
}

// Função para salvar dados no arquivo "dados.json"
function saveData(data) {
  fs.readFile('dados.json', (err, fileData) => {
    let dataList = [];
    if (!err && fileData.length > 0) {
      try {
        dataList = JSON.parse(fileData);
      } catch (e) {
        console.error("Erro ao interpretar JSON. Reiniciando dados.", e);
      }
    }
    dataList.push(data);
    fs.writeFile('dados.json', JSON.stringify(dataList, null, 2), (err) => {
      if (err) console.error('Erro ao salvar dados:', err);
    });
  });
}

// Criação do servidor
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  console.log('Recebendo requisição:', req.url);

  try {
    if (req.method === 'GET' && parsedUrl.pathname === '/saveData') {
      const { nome = '', tempo = '' } = parsedUrl.query;

      // Converte o parâmetro tempo para número
      const tempoNumber = parseFloat(tempo);
      if (isNaN(tempoNumber)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Valor de tempo inválido.' }));
      }

      // Formata o tempo utilizando o número convertido
      const tempoFormatado = formatTime(tempoNumber);

      // Cria um objeto com o valor numérico e o formatado
      const data = { nome, tempo: tempoNumber, tempoFormatado };

      console.log('Dados processados:', data);
      saveData(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Dados salvos com sucesso!', dados: data }));
      
    } else if (req.method === 'GET' && parsedUrl.pathname === '/dados') {
      fs.readFile('dados.json', (err, data) => {
        if (err) {
          console.error('Erro ao ler o arquivo:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Erro ao ler os dados' }));
          return;
        }

        let dataList = [];
        try {
          dataList = JSON.parse(data);
        } catch (error) {
          console.error('Erro ao interpretar os dados:', error);
        }

        // Ordena os dados do maior para o menor tempo (usando o valor numérico)
        dataList.sort((a, b) => b.tempo - a.tempo);

        // Seleciona somente os 10 maiores tempos
        const top10 = dataList.slice(0, 10);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(top10));
      });
      
    } else {
      // Lógica para carregar arquivos estáticos (index.html, etc)
      let filePath = './static' + (parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname);
      const extname = String(path.extname(filePath)).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml',
      };

      const contentType = mimeTypes[extname] || 'application/octet-stream';

      fs.readFile(filePath, (error, content) => {
        if (error) {
          if (error.code === 'ENOENT') {
            fs.readFile('./static/404.html', (error404, content404) => {
              res.writeHead(404, { 'Content-Type': 'text/html' });
              res.end(content404, 'utf-8');
            });
          } else {
            res.writeHead(500);
            res.end(`Desculpe, houve um erro no servidor: ${error.code} ..\n`);
          }
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        }
      });
    }
  } catch (err) {
    console.error('Erro durante o processamento da requisição:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Erro interno no servidor. Consulte o administrador.');
  }
});

// Porta do servidor
server.listen(3001, () => {
  console.log('Servidor rodando em http://127.0.0.1:3001');
});
