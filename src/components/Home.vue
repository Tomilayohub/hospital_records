<template>
    <div class="home container-fluid">
        <main role="main">
          <section class="jumbotron text-center bg-white mt-5">
            <div class="container">
                 <img alt="Vue logo" src="../assets/cbhr.png" width="150px" style="margin-bottom: 30px;">
                <h1>Consortium Blockchain Health Records</h1>
                <p class="lead text-muted">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam, atque minus ratione in aut eum repellat tempore? Deserunt officia aut asperiores aliquam! Dolore et vel, odit excepturi pariatur numquam dicta.
                </p>
            </div>
          </section>

          <div class="album py-5 bg-light">
            <div class="container">
              <div class="row">
                <div class="col-md-4">
                    <router-link :to="{name: 'administrator_login'}">
                        <div class="card mb-4 shadow-sm">
                            <div class="login-type-icon">
                                <i class="fas fa-user-shield fa-10x"></i>
                            </div>
                            <div class="card-body">
                                <h3 class="d-flex justify-content-center">
                                    Administrator Login
                                </h3>
                            </div>
                        </div>
                    </router-link>
                </div>
                <div class="col-md-4">
                    <router-link :to="{name: 'hospital_login'}">
                        <div class="card mb-4 shadow-sm">
                            <div class="login-type-icon">
                                <i class="fas fa-hospital-alt fa-10x"></i>
                            </div>
                            <div class="card-body">
                                <h3 class="d-flex justify-content-center">
                                    Hospital Login
                                </h3>
                            </div>
                        </div>
                    </router-link>
                </div>
                <div class="col-md-4">
                    <router-link :to="{name: 'patient_login'}">
                        <div class="card mb-4 shadow-sm">
                            <div class="login-type-icon">
                                <i class="fas fa-hospital-user fa-10x"></i>
                            </div>
                            <div class="card-body">
                                <h3 class="d-flex justify-content-center">
                                    Patient Login
                                </h3>
                            </div>
                        </div>
                    </router-link>               
                </div>
              </div>
            </div>
          </div>
        </main>
    </div>
</template>

<script>
    export default {
        name: 'Home',
    }
</script>

<style scoped>
    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");


    .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    @media (min-width: 768px) {
        .bd-placeholder-img-lg {
          font-size: 3.5rem;
        }
    }

    .login-type-icon {
        width: 100%;
        height: 225px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
