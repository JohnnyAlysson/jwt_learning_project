
const express = require('express');
const app = express();
const {db} =require("./db")
const cors = require('cors');

// console.log(db.clientes)

require("dotenv-safe").config();
const jwt = require('jsonwebtoken')


 
function verifyJWT(req, res, next){
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ auth: false, message: 'No token provided.' });
  
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ auth: false, message: 'Token format invalid.' });
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(401).json({ auth: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
}

app.use(cors());
app.use(express.json());

app.get('/',(req,res,next)=>{
  res.json({message: "Tudo ok por aqui!"});
});

app.get('/cliente', verifyJWT ,(req,res,next)=>{
  console.log("Retornou todos clientes!");
  res.json(db.clientes);
});

app.post('/login',(req,res,next)=>{
  try{

    for (let i in db.clientes) {
      console.log(db.clientes[i])

      if (req.body.user == db.clientes[i].nome && req.body.password == db.clientes[i].password) {
        const id = db.clientes[i].id
        const token = jwt.sign({id}, process.env.SECRET, {
          expiresIn: 100
        })
        return res.json({auth: true, token: token});
      }
    }
    
    
    return res.status(500).json({message: "Login inválido!"})
  }
  catch(error){
    console.log(`Erro: ${error}`)
    return res.status(500).json({
      message: "Erro ao realizar o login",
      error: error.message,
    });
  }

})

app.post('/logout', function(req, res) {
 res.json({ auth: false, token: null });
})

app.get('*',(req,res,next)=>{
  console.log("404 - Rota não encontrada!");
  res.json({message: "404 - Rota não encontrada!"});
});





app.listen(3000,()=>console.log("Servidor Escutando na porta 3000..."))


