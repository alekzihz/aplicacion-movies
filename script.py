

import ast
import sys
import pandas as pd
from rake_nltk import Rake
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer


#generos = sys.argv[1]

generos = "adventure fantasy family comedy drama romance action horror thriller crime"


#print("hola desde python ", generos)
df = pd.read_csv('data/movies_metadataAlta.csv')
#print(df[['genres', 'id']].head(-1))

df['Key_words'] = ""




df['genres'] = df['genres'].apply(ast.literal_eval)

def extract_and_lower_genres(genres_list):
    #return " ".join([genre['name'].lower() for genre in genres_list])
    return [genre['name'] for genre in genres_list]


# Aplicar la función a la columna 'genres' y asignar el resultado a la columna 'Key_words'
df['Key_words'] = df['genres'].apply(extract_and_lower_genres)
#df['overview'] = df['overview'].str.replace(",", " ").replace("'", "").replace("-", "").replace("(", "").replace(")", "").replace(".", "").replace(":", "").replace(";", "").replace("!", "").replace("?", "").replace("¿", "").replace("¡", "").replace("...", "")



#print(df[['Key_words', 'id']].head(-1))

df['palabras_claves'] = ""

'''
for index, row in df.iterrows():
    #plot = row['Key_words'] , " ", row['overview']
    plot = " ".join([str(row['Key_words']), str(row['overview'])])

    #print(plot)
    # instantiating Rake, by default it uses english stopwords from NLTK
    # and discards all puntuation characters as well
    r = Rake()



    # extracting the words by passing the text
    #print(r.extract_keywords_from_text(plot))
    #print(plot)
    r.extract_keywords_from_text(plot)

    # getting the dictionary whith key words as keys and their scores as values
    key_words_dict_scores = r.get_word_degrees()
    #print(key_words_dict_scores)
    # assigning the key words to the new column for the corresponding movie
    #row['Key_words'] = list(key_words_dict_scores.keys())
    df.at[index,'palabras_claves'] = list(key_words_dict_scores.keys())

    '''

#limpiamos los valores 
#df['palabras_claves'] = df['overview'].str.replace(",", " ")
df.to_csv('data/csvLimpio_dataframe.csv', index=False)

