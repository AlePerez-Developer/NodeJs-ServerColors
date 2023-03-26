import dotenv  from "dotenv";
dotenv.config();

class dbConfig{
    public dbUser: string;
    public dbPassword: string;
    public dbServer: string;
    public dbDatabase: string;
    
    constructor(){
        this.dbUser = process.env.DB_USER || '';
        this.dbPassword = process.env.DB_PASSWORD || '',
        this.dbServer = process.env.DB_SERVER || '',
        this.dbDatabase = process.env.DB_DATABASE || ''
    }
}

export default dbConfig;