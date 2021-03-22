const config = {

    //Puerto
    port: process.env.PORT || 3000,

    //Ambiente
    test_env: 'test',
    test_port: 3001,

    //Base de datos
    db: 'mongodb://localhost:27017/magnetomutants'
};

export default config;