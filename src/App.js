import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { HmacSHA256 } from 'crypto-js';
import * as jose from 'jose';

function App() {
  const [username, setUsername] = useState([])

  function joseJWT(){

    const secret = new TextEncoder().encode(
      'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
    )
    const alg = 'HS256'
    
    const jwt = new jose.SignJWT({ 'urn:example:claim': true })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer('urn:example:issuer')
      .setAudience('urn:example:audience')
      .setExpirationTime('2h')
      .sign(secret).then(e=>{

        const { payload, protectedHeader } = jose.jwtVerify(e, secret, {
          issuer: 'urn:example:issuer',
          audience: 'urn:example:audience',
        })
        console.log(jwt)
        
        console.log(protectedHeader)
  
        console.log(payload)
      })

   

      
   // console.log(jwt)

}


  function createAndSend(username){
    let token = "Basic "+(btoa("username:"+username));
    let firstPart = btoa(JSON.stringify({
      alg: "HS256",
      typ: "JWT"
    }));
    let secondPart = btoa(JSON.stringify(
      {
        sub: "1234567890",
        name: "John Doe",
        iat: 1516239022
      }
    ));
    let rawThirdPart = firstPart+"."+secondPart;
    let hash = HmacSHA256(rawThirdPart,"my-key");
    let jwtTokenSuffix = firstPart+"."+secondPart+"."+btoa(hash);
    let jwtToken = "Bearer "+jwtTokenSuffix;

    fetch('https://jsonplaceholder.typicode.com/todos/1',
    {
      method:'GET', 
      headers: {'Authorization': jwtToken}
    })
      .catch(e=>console.error(e))
      .then(response => response.json())
      .then(json => console.log(json));
  }
  return (
    <div className="App">
      <input type="text" onChange={e=>setUsername(e.target.value)} placeholder='Введите данные для формирования токена'/>
      <button onClick={e=>joseJWT()}>сформировать и отправить</button>
    </div>
  );
}

export default App;
