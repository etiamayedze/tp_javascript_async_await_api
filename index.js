import fastify from 'fastify';
// see axios doc on how to use it
import axios from 'axios';

const app = fastify({ logger: true });

app.get('/', async (req, res) => {
  return getAll();
});

//getting the catFact


// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Get cat facts
const getCatFact = (amount) => {
  return new Promise(resolve => {
    axios.get(`https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=${amount}`).then(res => {
      const data = res.data;
      let facts = [];
      for (let i = 0; i < data.length; i++) {
        facts.push(data[i].text);
      }
      resolve(facts);
    }).catch(err => {
      resolve(null);
    })
  });
};

// Get fox image
const getFoxImage = () => {
  return new Promise(resolve => {
    axios.get(`https://randomfox.ca/floof/`).then(res => {
      const data = res.data;
      resolve(data.image);
    }).catch(err => {
      resolve(null);
    })
  });
};

// Get days off by country
const getDayOff = (country) => {
  return new Promise(resolve => {
    axios.get(`https://date.nager.at/api/v2/PublicHolidays/2021/${country}`).then(res => {
      const data = res.data;
      resolve(data);
    }).catch(err => {
      resolve(null);
    })
  });
};

// Get all API
const getAll = () => {
  const catFact = getCatFact(2);
  const fox = getFoxImage();
  const dayOff = getDayOff('fr');

  return Promise.all([catFact, fox, dayOff]).then((values) => {
    let obj = {};

    obj['catFact'] = values[0];
    obj['foxPicture'] = values[1];
    obj['holidays'] = values[2];
    return obj;
  });
};

start();
