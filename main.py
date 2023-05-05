import requests
import pandas as pd   
import datetime

def excel(results):
    data_limpia = []
    current_date = datetime.datetime.now().strftime("%Y-%m-%d")
    for result in results:
        eid = result.get("eid", "")
        authors = result.get("dc:author", [])
        authors_ids = []
        author_ids = [author.get("authid", "") for author in authors]
        title = result.get("dc:title", "")
        year = result.get("prism:coverDate", "")[0:4]
        source_title = result.get("prism:publicationName", "")
        volume = result.get("prism:volume", "")
        issue = result.get("prism:issueIdentifier", "")
        art_no = result.get("prism:article-number", "")
        page_start = result.get("prism:startingPage", "")
        page_end = result.get("prism:endingPage", "")
        page_count = result.get("prism:pageCount", "")
        cited_by = result.get("citedby-count", "")
        doi = result.get("prism:doi", "")
        link = result.get("link", [{"@href": ""}])[0].get("@href", "")
        affiliations = result.get("affiliation", [])
        authors_with_affiliations = [f"{a.get('authname', '')}, {a.get('affilname', '')}" for a in affiliations]
        correspondence_address = result.get("correspondence", "")
        publisher = result.get("dc:publisher", "")
        document_type = result.get("subtypeDescription", "")
        publication_stage = result.get("subtype", "")
        open_access = result.get("openaccessFlag", "")
        source = result.get("source-id", "")
        fecha_anadido = current_date
        data_limpia.append({"EID": eid,"Autores": authors,"Autores IDs": author_ids,"Título": title,"Año": year,"Fuente": source_title, "Volumen": volume,"Número": issue,"Número de artículo": art_no,"Página inicial": page_start,"Página final": page_end,"Número de páginas": page_count,"Citado por": cited_by,"DOI": doi,"Enlace": link, "Afiliaciones": authors_with_affiliations, "Dirección de correspondencia": correspondence_address, "Editorial": publisher, "Tipo de documento": document_type, "Etapa de publicación": publication_stage, "Acceso abierto": open_access, "Fuente ID": source, "Fecha en que se añadió": fecha_anadido})

    df = pd.DataFrame(data_limpia)
    df.to_excel('datos_scopus.xlsx', index=False)

def extract():
    API_KEY = "INSERTE SU API_KEY DE SCOPUS AQUI"
    url = 'https://api.elsevier.com/content/search/scopus'
    query = 'affil("PUCP") OR affil("Pontificia Universidad Católica del Perú")'
    params = {
        'query': query,
        'apiKey': API_KEY,
        'count': 20,
        'start': 0
    }
    llamadas = 0
    results = []
    try:
        while True:
            response = requests.get(url, params=params)
            response.raise_for_status()
            llamadas += 1
            json_response = response.json()
            try:
                current_results = json_response['search-results']['entry']
            except KeyError:
                current_results = []
            results.extend(current_results)
            print(f'Número de resultados recuperados: {len(results)} de {json_response["search-results"]["opensearch:totalResults"]} totales')
            if len(current_results) == 0 or len(results) == json_response['search-results']['opensearch:totalResults']:
                break
            params['start'] += params['count']
            print(f'Número de llamadas a la API: {llamadas}')
    except requests.exceptions.HTTPError as e:
        print(f'Error de la API: {e.args[0]}')
        return results
    except Exception as e:
        print(f'Error inesperado: {e.args[0]}')
        return results
    excel(results)
    return

if __name__ == '__main__':
    extract()