
const RootComponent = {
    data() {
        return {
            movie: "",
            movieFiltradas:"",
            cacheMovies: [],
            message: "APP Movies!",
            loading: true
        };
    },

    mounted() {
        this.getMovie();
    },

    methods: {
        async getMovie() {
            try {
                const response = await fetch("/movies/all");
                const data = await response.json();
                this.movie = data;
                this.loading = false;
                this.cacheMovies = data;
            } catch (error) {
                console.error("Error al obtener películas:", error);
                // Manejar el error de alguna manera, por ejemplo, establecer this.loading en false
                this.loading = false;
            }
        },
        controladorBusqueda(moviesFiltradas){
            console.log("controladorBusqueda")
            console.log(moviesFiltradas)
            if(moviesFiltradas.length == 0){
                console.log("esto es cero")
                this.movie = this.cacheMovies;
            }
            else{
                this.movie = moviesFiltradas;
            }
        },
    },

    template:`
    
    <div>
        <!--h1>{{ message }}</h1-->
        <!-- Mostrar un indicador de carga mientras se obtienen las películas -->
        <div v-if="loading">Cargando...</div>

        <FilterMovie :peliculas="movie" @busqueda="controladorBusqueda"></FilterMovie> 
        <!-- Mostrar la lista de películas cuando la carga ha terminado -->
        <div v-if="!loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <MovieItem v-for="movie in movie" :key="movie.id" :movie="movie" />
        </div>
    </div>
    `
};

const MovieItem = {
    props: ["movie"],

    data() {
        return {
           belongs_to_collection: Object,
           poster_path : null

        };
    },

    methods:{
        async getImage(){
            const path_image = this.movie.poster_path;
            //const tmdbUrl = 'https://image.tmdb.org/t/p/w500' + path_image;
            //const filmtoroUrl = 'https://filmtoro.cz/img/film' + path_image;
            try {
                const resposta = await fetch('movies/image' + path_image);               
                const blob = await resposta.blob();

        // Crear una URL de datos directamente desde el Blob
                this.poster_path = URL.createObjectURL(blob);

            } catch (error) {
                console.error(error);
            }
        }
    },


    mounted() {
        this.getImage();      
    },
    template: `
    <section class="max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-md md:w-48 md:h-64 lg:w-64 lg:h-80">
        <img class="w-full h-48 object-cover" :src="poster_path" alt="movie.title">
        <div class="p-6">
            <h2 class="font-bold text-xl mb-2">{{ movie.title }}</h2>
            <p class="text-gray-700">{{ movie.description }}</p>
        </div>
    </section>




    `
}

const FilterMovie = {

    emits:["busqueda"],
    props:["peliculas"],

    data(){
        return{
            searchQuery: "",
            peliculasEncontradas: []
        }

    },
    methods:{
        searchMovies(){

            if(this.searchQuery == ""){
                this.peliculasEncontradas = [];
                this.$emit("busqueda", this.peliculasEncontradas);
                return;
            }
            this.peliculasEncontradas = this.peliculas.filter((movie) => {
                return movie.title.toLowerCase().includes(this.searchQuery.toLowerCase());
            });
        
            //console.log(this.peliculasEncontradas)
            this.$emit("busqueda", this.peliculasEncontradas);
        }

    },

    template:`
    <input v-model="searchQuery" @input="searchMovies" placeholder="Buscar películas" class="p-2 mb-4 border-gray-900 w-full">

    `
    
    
}




const app = Vue.createApp(RootComponent);
app.component("MovieItem",MovieItem);
app.component("FilterMovie", FilterMovie);
const vm = app.mount("#app");