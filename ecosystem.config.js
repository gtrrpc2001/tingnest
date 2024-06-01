const commonEnv = {
  PORT:process.env.PORT,        
  HOST:process.env.HOST,        
  NAME:process.env.NAME,
  PASSWORD:process.env.PASSWORD,  
  USER_GUARD_LOGIN:process.env.USER_GUARD_LOGIN,
  USER_GUARD_LOGOUT:process.env.USER_GUARD_LOGOUT,
  USER_ACTIVITY_LOGIN:process.env.USER_ACTIVITY_LOGIN,
  USER_ACTIVITY_LOGOUT:process.env.USER_ACTIVITY_LOGOUT,
  REDISHOST:process.env.REDISHOST,
  REDISPORT:process.env.REDISPORT,  
  NAVER_ACCESSKEY:process.env.NAVER_ACCESSKEY,
  NAVER_SECRETKEY:process.env.NAVER_SECRETKEY,
  NAVER_SERVICEID:process.env.NAVER_SERVICEID,
  COMPANYNUMBER:process.env.COMPANYNUMBER,
  JWT_SECRET:process.env.JWT_SECRET,
  JWT_EXPIRATION_TIME:process.env.JWT_EXPIRATION_TIME,
  DATABASE:process.env.DATABASE,
  REDISDB:process.env.REDISDB,
}

module.exports = {
    apps : [{
      name: "Tingproject",
      script: "./dist/main.js",
      args: "start:custom",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        BACKENDPORT:process.env.BACKENDPORT,        
        // DATABASE:process.env.DATABASE,
        // REDISDB:process.env.REDISDB, 
        ...commonEnv,
      },
      env_production: {
        NODE_ENV: "production",
        BACKENDPORT:process.env.DEFAULT,        
        // DATABASE:process.env.TDATABASE,
        // REDISDB:process.env.TREDISDB,
        ...commonEnv,
    }
    }]
  };