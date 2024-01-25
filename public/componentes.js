
const RootComponent = {
    data() {
        return {
            movies: [],
            cacheMovies: [],
            allMovies:[],
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
            sessionLogin: null,
            textButtonLogin: "Login",
        };
    },

    async mounted() {
        await this.getSession();
        this.getMoviesFromJSON();
        window.addEventListener("scroll", this.ControladorScroll);

        if (this.sessionLogin.message == "Unauthorized") {
            this.textButtonLogin = "Login";
        }
        else{
            this.textButtonLogin = "Logout";
        }

    },

    watch:{
        movies(){
            //console.log((this.movies.length))
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
                this.allMovies = data;
        
                // Obtener peliculas
                const startIndex = (this.page - 1) * 60;
                const endIndex = startIndex + 60;
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

        async getSession(){
            try {
                const response = await fetch(`/users/session`);
                this.sessionLogin = await response.json();
                
            } catch (error) {
                console.error("Error al obtener películas:", error);
                // Manejar el error de alguna manera, por ejemplo, establecer this.loading en false
                this.sessionLogin = null;
            }

        },

            async logout(){
                try {
                    const response = await fetch(`/users/logout`,{
                        method: 'GET',
                        credentials: 'include',
                    });
                    if(response.ok){
                        this.sessionLogin = null;
                        window.location.href = "index.html";
                    }
                    
                    //this.sessionLogin = await response.json();
                    //window.location.href = "login.html";
                } catch (error) {
                    console.error("Error al obtener películas:", error);
                    // Manejar el error de alguna manera, por ejemplo, establecer this.loading en false
                    //this.sessionLogin = null;
                }
            },

        operationLogin(){
            if (this.sessionLogin.message == "Unauthorized") {
                window.location.href = "login.html";
            }else{
                this.logout();
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

    },

  

    template:`
    
    <div>
        <!--h1>{{ message }}</h1-->
        <!-- Mostrar un indicador de carga mientras se obtienen las películas --> 
        <div style="background:blue; position:fixed; left:90%; top:10px; padding: 10px">
            <button  id="buttonLogin" @click="operationLogin">{{textButtonLogin}}</button>
        </div>
        <FilterMovie :peliculas="cacheMovies" @busqueda="controladorBusqueda"></FilterMovie> 
        <div class="" v-if="loading">Cargando...</div>
        <!-- Mostrar la lista de películas cuando la carga ha terminado -->
        <!--div v-if="!loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"-->
         
        
        
        <div v-if="!loading && movieFiltradas" class="grid" style="grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr)); grid-gap: 1rem;">
                <MovieItem v-for="movie in movies" :key="movie.id" :movie="movie" @show="showDescription" :description="enableDescription" :user="sessionLogin"></MovieItem>
            </div>            
    </div>

    




    `
};

const MovieItem = {
    props: ["movie","description",'user'],
    emits:["show"],

    data() {
        return {
           belongs_to_collection: Object,
           poster_path : null,
           year: null,
           title:"",
           countMovies:0, //no se usa
           details: false,
           likeText: '🤍',
           log: false,
           movieLiked :  false
          
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
           let categor = [];
          // categor = this.movie.genres === 'string' ? JSON.parse(this.movie.genres.replace(/'/g, '"')) :this.movie.genres;
           
           //console.log(typeof this.movie.genres)
           //console.log(categor.name)
           //let movie = null;
           


        },

        like(){
            
            if(this.likeText == '🤍'){
                this.likeText = '❤️';   
                console.log(this.movie.id)
            console.log(this.user.mail)
                this.likeMovie();
            }
            else{
                this.likeText = '🤍';
                this.removeLikeMovie();
            }
            //if(this.likeText == '❤️')this.likeText = '🤍';
            
        },

        async likeMovie(){
            const like = await fetch('/likes/addLike',{                    
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    movie: this.movie.id,
                    userMail: this.user.mail
                })
            }); 
        },

        async removeLikeMovie(){
            const like = await fetch('/likes/removeLike',{                    
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    movie: this.movie.id,
                    userMail: this.user.mail
                })
            });
        },

        async getLikeMovie(){
            const like = await fetch('/likes/movieUser',{                    
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    movie: this.movie.id,
                    userMail: this.user.mail
                })
            }); 
            const data = await like.text();
            if (data == "true") {
                this.likeText = '❤️';
                this.movieLiked = true;
            }
            else{
                this.likeText = '🤍';
                this.movieLiked = false;
            }
        }
        

    },

    watch: {
        //para cerrar las descripciones
        description(newVal){
            if(newVal==false){
                this.details=false;

                
            }
        }
    },
    

    mounted() {
        this.getImage();     
        this.log=this.user.logged;  
        if(this.log===true) {
            this.getLikeMovie();
        }   
    },

    created(){
        if (this.movie.release_date == null) {
            this.movie.release_date = "1970-01-01"
        }
        
        if(this.movie.release_date.length > 4)this.year = this.movie.release_date.substring(0,4);
        this.title = this.movie.original_title;      

        //console.log(this.log)
    },
    template: `
          
    <section>
        <img @click="showDescription" style="cursor:pointer"  class="w-full h-full object-cover" :src="movie.resource_image" alt="movie.title">
        <button v-if="log !== undefined || log === true" @click="like" class="">{{ likeText }}</button>
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

    methods:{
       
    },
           
          



   mounted(){
        //this.getMoviesRecomendacion();
    },


    template: `
    <div>
    <div style= "margin-left: 95%;">
        <button @click="closeDescription" class="text-2xl font-bold text-white">X</button>
    </div>

    <div class="relative">
      <img class="w-3/6 h-3/6 object-cover" :src="movie.resource_image" alt="movie.title">
      <h1>{{ movie.title }}</h1>
      <h2>{{ movie.overview }}</h2>
      <h2>{{ movie.release_date }}</h2>
      <h2>{{ movie.genres }}</h2>
    </div>

    <div class="bg-white">
        <legend>Where to watch</legend>
        <WidgetJustWatch :title="movie.title" :year="movie.release_date"></WidgetJustWatch>
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

    data(){
        return{
            //movie: this.title,
            yearFormatted: this.year
        }
    },

   mounted(){
        this.cargarPlataformas();

        
    },

  

    methods: {
        destroyWidget() {
            const widgetElement = document.querySelector('[data-jw-widget]');
            if (widgetElement) {
                widgetElement.parentNode.removeChild(widgetElement);
            }
        },

        cargarPlataformas(){
            if (this.year == null) {
                this.year = new Date("1970-01-01");
            }
            
            this.yearFormatted = new Date(this.year["$date"]).getFullYear();
            console.log(this.year)
            if (!window.JustWatch) {
                const script = document.createElement("script");
                script.src = "https://widget.justwatch.com/justwatch_widget.js";
                script.async = true;
                script.onload = this.initializeJustWatchWidget;
          
                document.head.appendChild(script);
              }
              else{
                const widgetElement = document.querySelector('[data-jw-widget]');
                //widgetElement.parentNode.removeChild(widgetElement);
                this.destroyWidget();
                const script = document.createElement("script");
                script.src = "https://widget.justwatch.com/justwatch_widget.js";
                script.async = true;
                script.onload = this.initializeJustWatchWidget;
          
                document.head.appendChild(script);
              }
              
          
            
            if (window.JWInit) {
                window.JWInit();
              }
    

        }
    },
    beforeDestroy() {
        this.destroyWidget();
    },

    template:`
    <div data-jw-widget
         data-api-key="ABCdef12"
         data-object-type="movie"
         :data-title="title"
         :data-year="yearFormatted"
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
            console.log(this.peliculas.length)
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
            if (this.categoriaSeleccionada != 1) {
                this.peliculasEncontradas = this.peliculas.filter((movie) => {
                    movie.genres = typeof movie.genres === 'string' ? JSON.parse(movie.genres.replace(/'/g, '"')) : movie.genres;
                    if(movie.genres){
                        for (const categoria of movie.genres) {
                            if(categoria.name == this.categorias[this.categoriaSeleccionada-1].name){
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
                this.peliculasEncontradas = this.peliculas.filter((movie) => {
                    movie.genres = typeof movie.genres === 'string' ? JSON.parse(movie.genres.replace(/'/g, '"')) : movie.genres;
                    if(movie.genres){
                        for (const categoria of movie.genres) {
                            if(categoria.name == this.categorias[idCategoria-1].name){
                                return movie
                            }
                        }

                    }
                });
                return this.$emit("busqueda", this.peliculasEncontradas,true);
            }
        }
    },

    mounted(){
        console.log(this.peliculas.length)
    },
    template:`

    <div style="display: flex; align-items: center;">
    <input v-model="searchQuery" @input="searchMovies" placeholder="Buscar películas" class="p-2 mb-4 border-gray-900">
    <select id="countries" class="p-2 mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option selected value="1">by title</option>
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