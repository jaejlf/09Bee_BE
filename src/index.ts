import express from 'express'; 

class App { 
    app: express.Application; 

    constructor() {
        this.app = express();
    } 
} 

const app = new App().app; 

app.get('/', (req: express.Request, res: express.Response) => { 
    res.send('Hello'); 
});     
    
app.listen(8080, () => { 
    console.log('Started server with 8080'); 
});​
