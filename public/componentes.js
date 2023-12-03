
const RootComponent = {
    data() {
        return {
            movie: "",
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
                console.log("completado");
            } catch (error) {
                console.error("Error al obtener películas:", error);
                // Manejar el error de alguna manera, por ejemplo, establecer this.loading en false
                this.loading = false;
            }
        }
    },

    template:`
    
    <div>
        <h1>{{ message }}</h1>
        <!-- Mostrar un indicador de carga mientras se obtienen las películas -->
        <div v-if="loading">Cargando...</div>
        <!-- Mostrar la lista de películas cuando la carga ha terminado -->
        <div v-if="!loading">
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
        //console.log(this.movie.belongs_to_collection)
        //console.log(this.movie)        
        /*if ('belongs_to_collection' in this.movie){
            this.belongs_to_collection = JSON.parse(this.movie.belongs_to_collection.replace(/'/g, '"'))
            this.poster_path = 'https://image.tmdb.org/t/p/w500'+this.belongs_to_collection.poster_path;        
        }
        
        else{
            this.poster_path = 'https://image.tmdb.org/t/p/w500'+this.movie.poster_path;
        }*/

        //this.poster_path = 'https://filmtoro.cz/img/film'+this.movie.poster_path;
    },
    template: `
    <div>
        <img :src="poster_path" :alt="movie.title" />
        <h2>{{ movie.title }}</h2>
        <p>{{ movie.overview }}</p>
    </div>
    `

    //<img :src="'https://image.tmdb.org/t/p/w500'+poster_path" :alt="movie.title" />

    //<img :src="https://image.tmdb.org/t/p/w500'+poster_path" :alt="movie.title" />

}




const app = Vue.createApp(RootComponent);

app.component("MovieItem",MovieItem);
const vm = app.mount("#app");