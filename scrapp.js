const cheerio = require('cheerio');
const request = require('request-promise');
const fs = require('fs');

let animesSearch = [];
let animeList = [];
let animeImages = [];

async function Spider() {
    for (let index = 82; index <= 82; index++) {
        const $ = await request({
            uri: `https://monoschinos2.com/animes?categoria=anime&genero=false&fecha=false&letra=false&p=${index}`,
            transform: body => cheerio.load(body)
        });

        const linkAnime = $('.col-md-4 a').each(async (i, el) => {
            const animeName = $(el).attr('href');
            animesSearch.push(animeName);
        });

        const xd = await $('.seriesimg img').each(async (i, el) => {
            const animeImage = $(el).attr('src');
            animeImages.push({ Image: animeImage });
        });
    }
}

const perAnime = async (animeLink) => {
    let title = '';
    let generos = [];
    let ImageFondo = '';
    try {
        const $ = await request({
            uri: animeLink,
            transform: body => cheerio.load(body)
        });
        const titleSearch = await $(".chapterdetails h1")
        title = $(titleSearch).text();

        const website = await $(".breadcrumb-item a").each(async (i, el) => {
            if($(el).text()!=="Latino"){
                generos.push($(el).text());
            }
        });

        const xd = await $('.herobg img')
        ImageFondo = $(xd).attr('src');


        return {
            Titulo: title.replace(' 1080P', '').replace(' 1080p', '').replace(' Latino',''),
            Generos: generos,
            Imagen: ImageFondo
        }
    } catch (e) {
        console.log(animeName);
        //console.log(e);
    }

}


const main = async () => {
    await Spider();
    for (let index = 0; index < animesSearch.length; index++) {
        const animeLink = animesSearch[index];
        const animeResponsed = await perAnime(animeLink);
        const anime = {
            Titulo: animeResponsed.Titulo,
            Generos: animeResponsed.Generos,
            Imagen: animeImages[index].Image,
            Background: animeResponsed.Imagen,
            Popularidad: 0
        }
        animeList.push(anime);
    }
    console.log(animeList);
    /* animeList.map(async (anime) => {
        const animeJson = JSON.stringify(anime);
        fs.writeFileSync(`.database.json`, animeJson,'utf8', (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    }); */

    fs.writeFileSync('.database.json', JSON.stringify(animeList), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

main();