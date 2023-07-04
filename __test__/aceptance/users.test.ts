import app from "../../src/app";
import { port } from "../../src/config";
import { AppDataSource } from "../../src/data-source";
import * as request from 'supertest';

let connection, server;
const testUser = {
    name: "test",
    email: "test@gmail.com",
}

beforeEach(async()=>{
    connection = await AppDataSource.initialize();
    await connection.synchronize(true);
    server = app.listen(port);
});

afterEach(()=>{
    connection.close();
    server.close();
})

it('should be no users',async ()=>{
    const response = await request(app).get('/users');
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
});

it('create users',async ()=>{
    const response = await request(app).post('/users').send(testUser);
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({...testUser, id:1});
});

it('should not create users if no name',async ()=>{
    const response = await request(app).post('/users').send({
        email: "test@gmail.com",
    });
    console.log(response.body.error);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).not.toBeNull();
    expect(response.body.error.length).toBe(1);
    expect(response.body.error[0]).toEqual({
        type: 'field',
        msg: 'Invalid value',
        path: 'name',
        location: 'body'
      });
    
});