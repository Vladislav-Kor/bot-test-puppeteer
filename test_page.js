const puppeteer = require('puppeteer');
const url = require('url');
const fs = require('fs');
const path = require('path');
(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    const glavUrl =  'URL';
    const postUrl = glavUrl;
    const objUrl = [];
    const error = [];
    error.push(
`<?php
###---------------------------████─████─███──███──████─████─████────██─████─█──██----------------------------
###---------------------------█──█─█──█───█──█─█──█──█─█──█─█──██──█─█─█──█─█─█──█---------------------------
###---------------------------█──█─█──█─███──█─█──████─████─████──█──█─████─████─█---------------------------
###---------------------------█──█─█──█───█─█████─█────█──█─█──██─█──█──█─█─█─█──█---------------------------
###---------------------------█──█─████─███─█───█─█────█──█─████──█──█──█─█─█──██----------------------------

###------------------████─████─████─████──█──█───██─████─████─█───────████─████─████─████─███─████-----------
###------------------█──█─█──█─█──█─█──██─█──█──█─█─█──█─█──█─█───────█──█─█──█─█────█──█──█──█──█-----------
###------------------█──█─█──█─████─████──█─██─█──█─████─█────████────████─████─████─█──█──█──████-----------
###------------------█──█─█──█──█─█─█──██─██─█─█──█─█──█─█──█─█──█────█────█──█─█──█─█──█──█──█──█-----------
###------------------█──█─████──█─█─████──█──█─█──█─█──█─████─████────█────█──█─████─████──█──█──█-----------
`);
    var myFunc = (async (postUrl, baseUrl) => {
        try {
            const res = await page.goto(postUrl); //захожу на страницу
            await new Promise(resolve => setTimeout(resolve, 30000));
            if ( res !== null && res.status() === 404) {                      
                error.push('со страницы '+baseUrl+' переходит на страницу error '+postUrl);
                console.log('\u001b[' + 33 + 'm' + ':(' + '\u001b[38m',postUrl,baseUrl)
                // return
            }
            const h1Text = await page.evaluate(() => {
                return document.querySelector('h1')?.textContent;
              });
            if (h1Text === '') {
                error.push('со страницы ' + baseUrl + ' переходит на пустую страницу ' + postUrl);
                console.log('\u001b[' + 33 + 'm' + ':(' + '\u001b[38m', postUrl, baseUrl);
            }
            if (h1Text === 'Ошибка 404') {
                error.push('со страницы ' + baseUrl + ' переходит на страницу 404 ' + postUrl);
                console.log('\u001b[' + 33 + 'm' + ':(' + '\u001b[38m', postUrl, baseUrl);
            }
            try {
                await page.waitForFunction(() => {
                    const images = document.querySelectorAll('img');
                    return Array.from(images).every((img) => img.naturalWidth > 0);
                }, { timeout: 30000 }); // Ждём загрузки картинок в течение 5 секунд
            } catch (error_text) {
                const notLoadedImages = await page.$$eval('img', (images) => {
                    return images.filter((img) => img.naturalWidth === 0).map((img) => img.src);
                });
                
                if (notLoadedImages.length > 0) {
                    if (notLoadedImages.join(', ')!==''&& notLoadedImages.join(', ').indexOf('.html')) {
                        // error.push('На странице ' + postUrl + ' не загружены следующие картинки: ' + notLoadedImages.join(', '));
                        error.push(notLoadedImages.join(', '));
                        console.log('\u001b[31m' + 'Не загружены картинки', postUrl, notLoadedImages);
                    }
                }
            }
            // добовляю в масив
            const pageUrls = await page.evaluate(() => { // забираю все url
                const urlArray = Array.from(document.links).map((link) => link.href);
                const uniqueUrlArray = [...new Set(urlArray)];
                return uniqueUrlArray;
            });
            for (let url1 of  pageUrls) { // прохожусь по всем url
                let filter = url1.startsWith(glavUrl) //проверяю url   
                if(filter) {
                    if (!objUrl.includes(url1)) {
                        objUrl.push(url1);  
                        console.log(`\u001b[` + 37 + 'm'+'со страницы'+' '+postUrl+' '+'переходит на страницу'+' '+url1);

                        await myFunc(url1, postUrl);
                         // все заного 
                    }
                }
            }
        } catch (error_log) {
            error.push('\n /*** \n не соответствует '+postUrl+' \n Получаемая ошибка бота: \n '+error_log +' \n \n ***/');
            console.log('\u001b[31m'+'не соответствует',postUrl)
            console.log(error_log)
            // await browser.close();
            // process.exit()
        }
    }); 
    
    await myFunc(postUrl, postUrl);

    var fs = require('fs');
    var errorStream = fs.createWriteStream("error.php");
    errorStream.once('open', function(fs) {
        for(let url2 of  error){
            errorStream.write(url2+`\n`);
        }
        errorStream.end();
    });
    
    console.log('\u001b[33m'+objUrl.length)

    await browser.close();
    
})();
