<template>
  <div>
  <md-toolbar>
    <h3 class="md-title">Deakin Smart Lights</h3>
  </md-toolbar>
  <div id="app">
    <link
      rel="stylesheet"
      href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons"
    />
    <div>
      <md-card md-with-hover class="md-card md-card-border">
        <h2 class="my-8">Add a new light</h2>
        <div class="flex text-center">
          <md-field class="my-8">
            <label>ID</label>
            <md-input v-model="id"></md-input>
          </md-field>
          <md-field class="my-8">
            <label>Building</label>
            <md-input v-model="buildingName"></md-input>
          </md-field>
          <md-field class="my-8">
            <label>Room</label>
            <md-input v-model="room"></md-input>
          </md-field>
          <md-field class="my-8">
            <label>Name</label>
            <md-input v-model="name"></md-input>
          </md-field>
          <md-button class="md-primary" @click="addLight">Add</md-button>
        </div>
      </md-card>
    </div>
    <div
      v-for="(building, index) in groupBy('buildingName', buildings)"
      :key="index"
      class="wrapper"
    >
      <h1>Building: {{ index }}</h1>
      <md-card
        md-with-hover
        class="md-card"
      >
        <div class="flex text-center">
          <p class="w-10 title">ID</p>
          <p class="w-20 title">Room</p>
          <p class="w-20 title">Name</p>
          <p class="w-10 title">Status</p>
          <p class="w-10 ml-4 title">Colour</p>
          <p class="w-5 ml-4 title">Brightness</p>
          <p class="w-20 title">Light</p>
          <p class="w-5 title">Delete</p>
        </div>
        
        <div        
          v-for="light in building"
          :key="light.id"
        >
          <div class="flex text-center pt-15">
            <p class="w-10">{{ light.id }}</p>
            <p class="w-20">{{ light.room }}</p>
            <p class="w-20">{{ light.name }}</p>
            <div class="w-10 ml-4">
              <md-switch v-model="light.status" value="On" class="md-primary" @change="updateLight(light)"></md-switch>
            </div>
            <md-field class="w-10 ml-4">
              <md-select
                v-model="light.colour"
                name="colour"
                id="colour"
                :placeholder="light.colour"
                @md-selected="updateLight(light)"
              >
                <md-option value="Gray">White</md-option>
                <md-option value="Red">Red</md-option>
                <md-option value="Green">Green</md-option>
                <md-option value="Blue">Blue</md-option>
                <md-option value="Purple">Purple</md-option>
                <md-option value="Pink">Pink</md-option>
                <md-option value="teal">teal</md-option>
                <md-option value="lavender">lavender</md-option>
                <md-option value="yellow">yellow</md-option>
                <md-option value="salmon">salmon</md-option>
              </md-select>
            </md-field>
            <md-field class="w-5 ml-4">
              <md-input
                v-model="light.brightness"
                type="number"
                min="1"
                max="100"
                @change="updateLight(light)"
              ></md-input
              >%
            </md-field>
            <div class="w-20">
              <div v-if="light.status == 'On'">
                <div
                  class="light"
                  :style="{
                    opacity: light.brightness + '%',
                    backgroundColor: light.colour,
                  }"
                ></div>
              </div>
            </div>
            <div class="w-5">
              <md-button
                class="md-icon-button md-primary"
                @click="deleteLight(light)"
              >
                <md-icon>delete</md-icon>
              </md-button>
            </div>
          </div>
        <md-divider></md-divider>
        </div>
      </md-card>
    </div>
  </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios'
export default {
  name: "App",
  components: {
    // HelloWorld
  },
  data: () => ({
    id: null,
    buildingName: "",
    room: "",
    name: "",
    status: [],
    colour: "Gray",
    brightness: "100",
    buildings: [],
  }),
  created() {
    axios.get('http://ec2-54-174-75-70.compute-1.amazonaws.com:5000/api/light/get').then(res => {
      this.buildings = res.data.light;
    })
  },
  methods: {
    groupBy: (key, array) =>
      array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
      }, {}),
    addLight() {
      axios.post('http://ec2-54-174-75-70.compute-1.amazonaws.com:5000/api/light/create',
        {
          id: this.id,
          buildingName: this.buildingName,
          room: this.room,
          name: this.name,
          status: "",
          colour: this.colour,
          brightness: this.brightness,
        }
      ).then(res => {
        this.buildings.push({
          id: res.data.light.id,
          buildingName: res.data.light.buildingName,
          room: res.data.light.room,
          name: res.data.light.name,
          status: res.data.light.status,
          colour: res.data.light.colour,
          brightness: res.data.light.brightness,
        })
        this.id = null,
        this.buildingName = "",
        this.room = "",
        this.name = "",
        this.status = [],
        this.colour = "Gray",
        this.brightness = "100"

      }).catch(() => {
          console.log("FRONTEND ERR: Create")
      })
    },
    deleteLight(light) {
      axios.post('http://ec2-54-174-75-70.compute-1.amazonaws.com:5000/api/light/delete/' + light.id).then(() => {
        var index = this.buildings.findIndex(function(x){
          return x.id === light.id;
        })
        if (index !== -1) this.buildings.splice(index, 1);
    }).catch(() => {
      console.log("FRONTEND ERR: Delete")
    })
    },
    updateLight(light) {
      axios.post('http://ec2-54-174-75-70.compute-1.amazonaws.com:5000/api/light/update/' + light.id, {
        status: light.status,
        colour: light.colour,
        brightness: light.brightness
      }).then(res => {
        this.buildingName.push({
          status: res.data.light.status,
          colour: res.data.light.colour,
          brightness: res.data.light.brightness,
        })
      }).catch(() => {
          console.log("FRONTEND ERR: Update")
      })
    }
  },
};
</script>
<style>
#app {
  color: #2c3e50;
  margin: 4rem;
}
.toolbar {
  position: fixed !important;
  top: 0 !important;
}
.wrapper {
  margin-top: 2rem;
}
.md-card {
  padding: 1rem;
}
.md-card-border {
  border-bottom: 2px purple solid !important;
}
h1 {
  font-size: 30px;
}
h2 {
  font-size: 30px;
  font-weight: 400;
}
.flex {
  display: flex;
}
.w-5 {
  width: 5% !important;
}
.w-10 {
  width: 10% !important;
}
.w-20 {
  width: 20%;
}
.w-50 {
  width: 50%;
}
.text-center {
  text-align: center;
}
p.title {
  font-weight: 600;
}
.ml-4 {
  margin-left: 1rem !important;
}
.my-25 {
  margin-left: 25%;
  margin-right: 25%;
}
.my-8 {
  margin-left: 2rem !important;
  margin-right: 2rem !important;
}
.ml-20 {
  margin-left: 20px;
}
.light {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: auto;
  filter: blur(3px);
}
.pt-15 {
  padding-top: 1.5rem;
}
</style>