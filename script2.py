

import ast
import sys
import pandas as pd
from rake_nltk import Rake
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
import h5py
df = pd.read_csv('data/csvLimpio_dataframe.csv')

#df['Key_words']=df['Key_words'].replace(",", " ")
print(df[['Key_words']].head(-1))
def convertir_a_cadena(lista):
    return "[" + " ".join(lista) + "]"

# Aplicar la función a la columna correspondiente del DataFrame
#df['Key_words'] = df['Key_words'].apply(eval).apply(convertir_a_cadena)

# Guardar el DataFrame modificado si es necesario
# df.to_csv('tu_archivo_modificado.csv', index=False)

# Mostrar el DataFrame modificado
#print(df)


#print(df[['palabras_claves', 'id']].head(-1))

#df['palabras_claves'] = df['overview'].str.replace(",", " ")
#df.to_csv('data/csvLimpio_dataframe.csv', index=False)

#print(df[['Key_words', 'id']].head(-1))

#print(df[['palabras_claves', 'id']].head(-1))

#df[]

#list['bag_of_words'] = [    'apple orange banana',    'banana pineapple',    'orange pineapple apple']

print(df['Key_words'])
count = CountVectorizer()
count_matrix = count.fit_transform(df['Key_words'])
cosine_sim = cosine_similarity(count_matrix, count_matrix)

#print("matriz generada")

np.savez_compressed('data/cosine_sim_compressed2enformatooriginal.npz',cosine_sim)



print("guardado")

#datos = np.load('data/cosine_sim_compressed.npz')


#print("guardando en el h5")
#with h5py.File('data/cosine_sim.h5', 'w') as hf:
#    hf.create_dataset('cosine_sim', data=datos['arr_0'])


print("fin")
#print(datos['arr_0'])

