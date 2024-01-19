
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
            searchON: false,
        };
    },

    mounted() {
        this.getMoviesFromJSON();
        window.addEventListener("scroll", this.ControladorScroll);
    },

    watch:{
        movies(){
            console.log((this.movies.length))
        }
    },

    methods: {
        async getMovieApi() {
            try {
                console.log("page: "+this.page)
                const response = await fetch(`/movies/all/${this.page}`);
                const data = await response.json();
                this.movies = [...this.movies, ...data];
                this.cacheMovies = [...this.cacheMovies, ...data];               
                this.loading = false;
                this.movieFiltradas= true;
                this.page++;
                this.stateScroll = true;
            } catch (error) {
                console.error("Error al obtener películas:", error);
                // Manejar el error de alguna manera, por ejemplo, establecer this.loading en false
                this.loading = false;
            }
        },

        async getMoviesFromJSON() {
            try {        
                const jsonData = await fetch('appmovie.moviedbE.json'); 
                const data = await jsonData.json();
        
                // Obtener peliculas
                const startIndex = (this.page - 1) * 10;
                const endIndex = startIndex + 10;
                const moviesChunk = data.slice(startIndex, endIndex);
        
                
                if (moviesChunk.length === 0) {
                    console.log("No hay más películas para cargar.");
                    this.stateScroll = false;
                    this.searchON = true; 
                    return;
                }
        
                // Actualizar la lista de películas
                this.movies = [...this.movies, ...moviesChunk];
                this.cacheMovies = [...this.cacheMovies, ...moviesChunk];
        
                this.loading = false;
                this.movieFiltradas = true;
                this.page++;
                this.stateScroll = true;
            } catch (error) {
                console.error("Error al obtener películas desde el JSON:", error);
                this.loading = false;
            }
        },
        


        controladorBusqueda(moviesFiltradas, activarBusqueda){
            if(moviesFiltradas.length == 0){
                this.movies = this.cacheMovies;
                this.searchON = activarBusqueda;
                this.movieFiltradas = false;
            }
            else{
                this.movies = moviesFiltradas;
                this.searchON = activarBusqueda
                this.movieFiltradas = true;
            }
        },

        ControladorScroll(){
            if (this.searchON == false){
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
    
                if (scrollY + windowHeight >= documentHeight - 200) {
                    if(this.stateScroll){
                        this.stateScroll = !this.stateScroll;
                        this.getMoviesFromJSON();
                    }
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
       
       
        <FilterMovie :peliculas="cacheMovies" @busqueda="controladorBusqueda"></FilterMovie> 
        <div class="" v-if="loading">Cargando...</div>
        <!-- Mostrar la lista de películas cuando la carga ha terminado -->
        <!--div v-if="!loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"-->
            <div v-if="!loading && movieFiltradas" class="grid" style="grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr)); grid-gap: 1rem;">
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

                this.movie.resource_image = "images/notfound.webp"
            }

            /*

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
                }*/
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
        if (this.movie.release_date == null) {
            this.movie.release_date = "1970-00-00"
        }
        
        if(this.movie.release_date.length > 4)this.year = this.movie.release_date.substring(0,4);
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
            peliculasEncontradas: [],
            categoriaSeleccionada: 1,
            peliculasChild: this.peliculas,
            categorias : [{
                id: 1,
                name: "All"
            },
            {
                id: 2,
                name: "Action"
            },
            {
                id: 3,
                name: "Comedy"
            },
            {
                id: 4,
                name: "Drama"
            },
            {
                id: 5,
                name: "Family"
            
            }]
        }

    },
    methods:{
        searchMovies(){       
            if(this.searchQuery == ""){
                console.log("categoria selccionada: "+this.categoriaSeleccionada)
                this.peliculasEncontradas = [];
                this.$emit("busqueda", this.peliculas, false);

                console.log("cuando es vacio")
                this.categorizadasMovies(this.categoriaSeleccionada);
                return;
            }

            this.peliculasEncontradas = this.peliculas.filter((movie) => {
                return movie.title.toLowerCase().includes(this.searchQuery.toLowerCase());
            });
            this.$emit("busqueda", this.peliculasEncontradas, true);
        },
        changeCategorias(){         
            this.peliculasEncontradas = [];
            this.$emit("busqueda", this.peliculas,false);

            console.log(this.peliculasChild.length)

            console.log("antes de filtrar child")
            if (this.categoriaSeleccionada != 1) {
                this.peliculasEncontradas = this.peliculas.filter((movie) => {
                    console.log(this.categorias[this.categoriaSeleccionada-1].name)
                    movie.genres = typeof movie.genres === 'string' ? JSON.parse(movie.genres.replace(/'/g, '"')) : movie.genres;
                    if(movie.genres){
                        for (const categoria of movie.genres) {
                            if(categoria.name == this.categorias[this.categoriaSeleccionada-1].name){
                                console.log("he encontrado"+movie.title)
                                return movie
                            }
                        }

                    }
                });
                return this.$emit("busqueda", this.peliculasEncontradas,true);
            }
            
        },
        categorizadasMovies(idCategoria){
            
            if (idCategoria!=1){

                console.log("categorizando")
                this.peliculasEncontradas = this.peliculas.filter((movie) => {
                    movie.genres = typeof movie.genres === 'string' ? JSON.parse(movie.genres.replace(/'/g, '"')) : movie.genres;
                    if(movie.genres){
                        for (const categoria of movie.genres) {
                            if(categoria.name == this.categorias[idCategoria-1].name){
                                console.log("he encontrado"+movie.title)
                                return movie
                            }
                        }

                    }
                });
                console.log("peliculas encontradas: "+this.peliculasEncontradas.length)
                return this.$emit("busqueda", this.peliculasEncontradas,true);
            }
        }
    },
    template:`
    <div style="display: flex; align-items: center;">
    <input v-model="searchQuery" @input="searchMovies" placeholder="Buscar películas" class="p-2 mb-4 border-gray-900">
    <select id="countries" class="p-2 mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option selected value="1">by title</option>
        <option value="2">Canada</option>
        <option value="3">France</option>
        <option value="DE">Germany</option>
    </select>
</div>

    <select v-model="categoriaSeleccionada" class="p-2 mb-4 border-gray-900 w-full" @change="changeCategorias">
        <option @select="" v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">{{categoria.name}}</option>
    </select>

    `  
}




const app = Vue.createApp(RootComponent);
app.component("MovieItem",MovieItem);
app.component("DescriptionMovie",DescriptionMovie);
app.component("FilterMovie", FilterMovie);
app.component("WidgetJustWatch", WidgetJustWatch);
const vm = app.mount("#app");