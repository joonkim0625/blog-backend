const env = {
  database: "deufl768fb3i3u",
  username: "wanekzmadaokri",
  password: "08d510398645623b06e91307d0b3c924285caf2ff5b521aefd848ce69255f6d6",
  host: "ec2-35-172-73-125.compute-1.amazonaws.com",
  port: "5432",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

module.exports = env;
