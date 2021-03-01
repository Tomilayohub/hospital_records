<template>
  <div id="app">
    <app-navbar class="app-navbar"></app-navbar>
    <router-view class="app" />
  </div>
</template>

<script>
import Web3 from 'web3';

import AppNavbar from './components/AppNavbar' 

export default {
  name: 'App',
  components: {
    'app-navbar': AppNavbar
  },

  methods: {
    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        } 
    },

    async loadBlockchainData() { 
        const web3 = window.web3
        
        // load account
        const accounts = await web3.eth.getAccounts()
        console.log("Accounts", accounts)

        // for (let i = 0; i < 10; i++)
        //    console.log('account['+i+']: '+accounts[i]);

        const chainId = await web3.eth.getChainId();
        console.log("Chain ID", chainId)

        const networkId = await web3.eth.net.getId();
        console.log("Network ID", networkId)
    },
  },

  async created() {
      await this.loadWeb3()
      await this.loadBlockchainData()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  width: 100% !important;
  margin: 0;
  overflow-x: hidden !important;
}
.app-navbar, .app {
  width: 100% !important;
  margin: 0;
}
#app-navbar a {
  font-weight: bold;
  color: #fefefe;
}
#app-navbar a.router-link-exact-active {
  color: #42b983;
}
</style>
