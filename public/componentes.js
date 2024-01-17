
const RootComponent = {
    data() {
        return {
            movies: [],
            cacheMovies: [],
            movieFiltradas:"",
            message: "APP Movies!",
            loading: true,
            startIndex: 0,
            batchSize:100,
            scrollThreshhold: 200,
            page: 1,
            stateScroll: false,
            enableDescription: false,
        };
    },

    mounted() {
        this.getMovie();
        window.addEventListener("scroll", this.ControladorScroll);
    },

    watch:{
        movies(){
            console.log((this.movies.length))
        }
    },

    methods: {
        async getMovie() {
            try {
                //console.log("Obteniendo películas...")
                console.log("page: "+this.page)
                const response = await fetch(`/movies/all/${this.page}`);
                const data = await response.json();
                //this.movies = data;

     
                this.movies = [...this.movies, ...data];
                this.cacheMovies = [...this.cacheMovies, ...data];               
                this.loading = false;
                this.page++;
                this.stateScroll = true;
            } catch (error) {
                console.error("Error al obtener películas:", error);
                // Manejar el error de alguna manera, por ejemplo, establecer this.loading en false
                this.loading = false;
            }
        },
        controladorBusqueda(moviesFiltradas){
           
            if(moviesFiltradas.length == 0){
                this.movies = this.cacheMovies;
            }
            else{
                this.movies = moviesFiltradas;
            }
        },

        ControladorScroll(){
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollY + windowHeight >= documentHeight - 200) {
                if(this.stateScroll){
                    this.stateScroll = !this.stateScroll;
                    this.getMovie();
                }
            }


        },

        beforeDestroy() {
            window.removeEventListener('scroll', this.handleScroll);
          },

        showDescription() {
            this.enableDescription = !this.enableDescription;
          },
    },

    created() {
        //this.page=1;
    },

  

    template:`
    
    <div>
        <!--h1>{{ message }}</h1-->
        <!-- Mostrar un indicador de carga mientras se obtienen las películas -->
        <button class="bg-red-500">Botón Primero</button>

       
        <FilterMovie :peliculas="movies" @busqueda="controladorBusqueda"></FilterMovie> 
        <div class="" v-if="loading">Cargando...</div>
        <!-- Mostrar la lista de películas cuando la carga ha terminado -->
        <!--div v-if="!loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"-->
        <div v-if="!loading" class="grid" style="grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr)); grid-gap: 1rem;">
            <MovieItem v-for="movie in movies" :key="movie.id" :movie="movie" @show="showDescription" :description="enableDescription"></MovieItem>
        </div>
    </div>
    `
};

const MovieItem = {
    props: ["movie","description"],
    emits:["show"],

    data() {
        return {
           belongs_to_collection: Object,
           poster_path : null,
           year: null,
           title:"",
           countMovies:0, //no se usa
           details: false,
          
        };
    },

    computed:{
        mostrarCargar(){
            //return this.startIndex < this.movie.length;
        }
    },

    methods:{
        async getImage(){

            if (this.movie.resource_image == "") {

                console.log ("buscando: "+this.movie.title)
                const path_image = this.movie.poster_path;
                const tmdbUrl = 'https://image.tmdb.org/t/p/w500' + path_image;
                const filmtoroUrl = 'https://filmtoro.cz/img/film' + path_image;
                try {
                    const resposta = await fetch('movies/image' + path_image);               
                    const blob = await resposta.blob();

            // Crear una URL de datos directamente desde el Blob
                    this.poster_path = URL.createObjectURL(blob);

                    //this.movie.poster_path = this.poster_path;
                    if (this.poster_path != tmdbUrl || this.poster_path != filmtoroUrl) this.movie.resource_image = "images/notfound.webp"
                    else{
                        this.movie.resource_image = this.poster_path;
                    }
                    
                } catch (error) {
                    console.error(error);
                }
            }
        },

        showDescription(){   
           this.details=true;
           this.$emit("show");
        }
        

    },

    watch: {
        description(newVal){
            if(newVal==false){
                this.details=false;
            }
        }
    },
    

    mounted() {
        this.getImage();          
    },

    created(){
        this.year = this.movie.release_date.substring(0,4);
        this.title = this.movie.original_title;      
    },
    template: `
    <section @click="showDescription" >
        <img class="w-full h-full object-cover" :src="movie.resource_image" alt="movie.title">
    <!--div class="bg-white">
        <WidgetJustWatch :title="title" :year="year"></WidgetJustWatch>
    </div-->
    </section>    
        <DescriptionMovie v-if="description && details" @close="showDescription" :movie="movie" style=" 
        width: 80%;
        height: 100%;
        background-color: white;
        position: absolute;
        top: 0;
        left: 0;
        overflow-y: scroll;
        justify-content: center;
        align-items: center;">
        
        </DescriptionMovie>
   
    `
}

const DescriptionMovie = {
    props : ["movie"],
    data() {
      return {
        message: "DescriptionMovie",

      };
    },


    template: `
    <div>
    <div style= "
    margin-left: 95%;
  
    ">
        <button @click="closeDescription" class="text-2xl font-bold text-white">X</button>
    </div>

    <div class="relative">
      <img class="w-3/6 h-3/6 object-cover" :src="movie.resource_image" alt="movie.title">
      <h1>{{ movie.title }}</h1>
      <h2>{{ movie.overview }}</h2>
    </div>

    <article>
      <div>
        This is a simple modal popup in Vue.js
      </div>
    </article>
    </div>

    `,
    methods: {
      closeDescription() {
        this.$emit("close");
      },

      
    },
  };

const WidgetJustWatch = {
    props:["title","year"],
    mounted(){
        if (!window.JustWatch) {
            const script = document.createElement("script");
            script.src = "https://widget.justwatch.com/justwatch_widget.js";
            script.async = true;
            script.onload = this.initializeJustWatchWidget;
      
            document.head.appendChild(script);
          }
        
        
        
        if (window.JWInit) {
            window.JWInit();
          }

    },

    template:`
    <div data-jw-widget
         data-api-key="ABCdef12"
         data-object-type="movie"
         :data-title="title"
         :data-year="year"
    ></div>
    
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
            this.$emit("busqueda", this.peliculasEncontradas);
        }
    },
    template:`
    <input v-model="searchQuery" @input="searchMovies" placeholder="Buscar películas" class="p-2 mb-4 border-gray-900 w-full">
    <select class="p-2 mb-4 border-gray-900 w-full">
        <option value="1">Todas</option>
        <option value="2">Acción</option>
        <option value="3">Comedia</option>
        <option value="4">Drama</option>
        <option value="5">Terror</option>
    </select>

    `  
}




const app = Vue.createApp(RootComponent);
app.component("MovieItem",MovieItem);
app.component("DescriptionMovie",DescriptionMovie);
app.component("FilterMovie", FilterMovie);
app.component("WidgetJustWatch", WidgetJustWatch);
const vm = app.mount("#app");