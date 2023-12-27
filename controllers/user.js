import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";
const secret = 'test';


export const crearUsuario= async(req,res)=>{

  const {email} = req.body;
  const existeUser= await UserModal.findOne({email:email});
  console.log(email)
  if(existeUser){
      const error=new Error("Usuario ya registrado");
      return res.status(400).json({msg:error.message})
  }
  try{
      const usuario= new UserModal(req.body);

      const usuarioAlmacenado= await usuario.save();

      res.json({msg:"Usuario Creado Correctamente, Revista tu email para confirmar tu cuenta"});
   
  }
  catch(error){
      console.log(error);
  }
 
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "Usuario no existe" });

    const isPasswordCorrect = await oldUser.comprobarPasword(password);
    
    if (!isPasswordCorrect){
      const error = new Error("El password es incorrecto");
      return res.status(403).json({msg:error.message});
    } 

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, process.env.JWT_SECRET , { expiresIn: "1h" });

    res.status(200).json({ result:{ name: oldUser.name, email: oldUser.email }, token });
  } catch (err) {
    
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
  }
};


export const perfil = async (req,res)=>{
  const {user} = req;
  res.json({user});
  
}
