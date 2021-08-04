/*********************************************************/
// Declare variables
/*********************************************************/

// Change the path if you are executing the script from elsewhere but your desktop
#include "~/desktop/CardAutomatisation/JSON-js-master/json2.js";

var document = app.activeDocument;

var widthFlavourText = document.width - 123;
var heightFlavourText = document.height - 470;
var heightNameText = document.height/2 - 143;
var widthNameText = document.width - 150;

// IMPORTANT! Change to your own path of choice. If trying to export in a folder, make sure the folder exist! Else nothing will happen. The string is case sensitive!
var exportPath = "~/desktop/Cards/";
var cardsJsonPath = "~/desktop/CardAutomatisation/Cards.json";

var tokenCards = [];
var spellCards = [];
var monsterCards =[];

var whiteColour = new RGBColor();
whiteColour.red = 255;
whiteColour.green = 255;
whiteColour.blue = 255;

var textSize = 150;
var textFontName = "MS-PGothic";

/*********************************************************/
// Declare functions
/*********************************************************/

function cardAttributeLayer(fvText,costText,nameText,cdText)
{
    // Get the active document. Preferably it would be the document with the card design
    var document = app.activeDocument;

    // Create a layer 
    var CALayer = document.layers.add();
    CALayer.name = "Card Attributes"

    // Add all the text to the given layer
    generateFlavourText(fvText);
    generateCardText(cdText);
    generateCostTextLeft(costText);
    generateCostTextRight(costText);
    generateCardNameText(nameText);

    // Export the card
    exportCard(exportPath, nameText);

    // Remove the layer to prevent text overlapping
    CALayer.remove();
}


function generateFlavourText(text)
{
    // Area for the text that would be drawn to display the text
    var rectRef = document.pathItems.rectangle(heightFlavourText, (widthFlavourText *-1)+30, 155, 20);        

    // Creating a layer in the Illustrator that would hold the text reference
    var textLayer = document.textFrames.areaText(rectRef);
    
    var layerName = "Flavour text/Monster Stats"
    
    // Changing the layer's name
    textLayer.name = layerName;

    // Setting the contents of the layer
    textLayer.contents = text;

    // Setting the position of the text layer
    textLayer.position = [widthFlavourText -45, heightFlavourText];

    // Accessing the text properties
    var textRange = textLayer.textRange;
    textRange.justification = Justification.CENTER;
    textRange.characterAttributes.fillColor = whiteColour;
    textRange.characterAttributes.textFont.name = textFontName;
    
    document.pageItems.getByName(layerName).textRange.characterAttributes.size = 8;
}

function generateCardNameText(text)
{
    // Area for the text that would be drawn to display the text
    var rectRef = document.pathItems.rectangle(heightNameText, (widthFlavourText *-1)+30, 120, 30);        

    // Creating a layer in the Illustrator that would hold the text reference
    var textLayer = document.textFrames.areaText(rectRef);
    
    // Changing the layer's name
    textLayer.name = "Card Name";

    // Setting the contents of the layer
    textLayer.contents = text;

    // Setting the position of the text layer
    textLayer.position = [widthNameText, heightNameText];

    // Accessing the text properties
    var textRange = textLayer.textRange;
    textRange.justification = Justification.CENTER;
    textRange.characterAttributes.fillColor = whiteColour;
    textRange.characterAttributes.textFont.name = textFontName;


}
function generateCardText(text)
{

    // Check the text length, and set the size of the rectangle accordingly
    if(text.length >= textSize)
    {
        var rectRef = document.pathItems.rectangle(document.height/2 - 270, (widthFlavourText *-1)+70, 150, 70);        
    }
    else
    {
        var rectRef = document.pathItems.rectangle(document.height/2 - 295, (widthFlavourText *-1)+70, 150, 35);
    }

    // Layer for the text
    var textLayer = document.textFrames.areaText(rectRef);

    // Name of the layer
    var layerName = "Card Text"

    textLayer.name = layerName ;
    textLayer.contents = text;

    // Accessing the text's properties
    var textRange = textLayer.textRange;
    textRange.justification = Justification.CENTER;
    textRange.characterAttributes.fillColor = whiteColour;
    textRange.characterAttributes.textFont.name = textFontName;

    // Change the size of the text according to the length of it
    if(text.length >= textSize)
    {
        document.pageItems.getByName(layerName).textRange.characterAttributes.size = 8;
    }
    else
    {
        document.pageItems.getByName(layerName).textRange.characterAttributes.size = 10;
    }  
}

function generateCostTextLeft(text)
{
    // Create a text box layer
    var textLayer = document.textFrames.add();
    
    textLayer.name = "Cost Left";
    textLayer.contents = text;
    textLayer.position = [widthFlavourText - 50, document.height/2 - 130];

    // Accessing the properties of the text
    var textRange = textLayer.textRange;
    textRange.characterAttributes.fillColor = whiteColour;
}

function generateCostTextRight(text)
{
    // Create a text box layer
    var textLayer = document.textFrames.add();

    textLayer.name = "Cost Right";
    textLayer.contents = text;
    textLayer.position = [widthFlavourText + 110, document.height/2 - 130];
    
    // Accessing the properties of the text
    var textRange = textLayer.textRange;
    textRange.characterAttributes.fillColor = whiteColour;
}

function exportCard(path, cardName)
{
    document.exportFile(File(path + cardName), ExportType.PNG24);
}

function CardCreation()
{
    // Reading the cards from the json file
    var cards = ReadCards();

    // Looping through each entry in the cards object
    for(key in cards)
    {
        // Check the card type and push it into the corresponding array
        if(cards.hasOwnProperty(key) && cards[key].Type == "Spell")
        {
            spellCards.push(cards[key]);
        }   
        else if(cards.hasOwnProperty(key) && cards[key].Type == "Monster")
        {
            monsterCards.push(cards[key]);
        }
        else
        {
            tokenCards.push(cards[key]);
        }
    }

    // Looping through the monsters' array and exporting all the cards that have been stored there 
    for (var i = 0; i < monsterCards.length; i++) 
    {
        cardAttributeLayer(monsterCards[i].Flavour_Text,monsterCards[i].Cost,monsterCards[i].Name,monsterCards[i].Text);
    };

    // Looping through the spells' array and exporting all the cards
    for(var i = 0; i < spellCards.length; i++)
    {
        cardAttributeLayer(spellCards[i].Flavour_Text, spellCards[i].Cost, spellCards[i].Name, spellCards[i].Text);
    };

    // Looping through the tokens array.
    for(var i = 0; i < tokenCards.length; i++)
    {
        cardAttributeLayer(tokenCards[i].Flavour_Text, tokenCards[i].Cost, tokenCards[i].Name, tokenCards[i].Text);
    };
}

function ReadCards()
{
    // Gets the file with the cards
    var cardsFile = new File(cardsJsonPath);
    cardsFile.open("r");
    var cardsFromFile = cardsFile.read();
    cardsFile.close();

    // Parsing the json string to JS Object
    var cardsParsed = JSON.parse(cardsFromFile);
    return cardsParsed;
}

/*********************************************************/
// Execute functions 
/*********************************************************/

CardCreation();


alert("Done");
