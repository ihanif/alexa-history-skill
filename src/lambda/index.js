/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

// TODO: Add 10 facts each containing a four-digit year
const facts = [
    "The field of AI is considered to have its origin in 1950, with publication of British mathematician Alan Turing's paper, Computing Machinery and Intelligence.",
    "The term, Artificial Intelligence, was coined in 1956 by mathematician and computer scientist John McCarthy, at Dartmouth College, in New Hampshire.",
    "AI flourished till 1974 the difficult years that followed would later be known as an AI winter",
    "In the 1980’s John Hopfield and David Rumelhart popularized deep learning techniques",
    "In 1997 world chess champion and grand master Gary Kasparov was defeated by IBM’s Deep Blue",
    "Walter Pitts and Warren McCulloch analyzed networks of idealized artificial neurons and showed how they might perform simple logical functions in 1943",
    "In 1951 Minsky built the first neural net machine the SNARC",
    "The second AI winter started in 1987",
    "In 2005 a Stanford robot won the DARPA Grand Challenge by driving autonomously for 131 miles along an unrehearsed desert trail",
    "By 2016 the market for AI-related products hardware and software reached more than 8 billion dollars"
];

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent';
  },
  handle(handlerInput) {
    const factArr = facts;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};


// TODO: Create a handler for the GetNewYearFactHandler intent
// Use the handler above as a template
// ============================================================
const GetNewYearFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewYearFactIntent');
  },
  handle(handlerInput) {
    const intent = handlerInput.requestEnvelope.request.intent;
    let returnRandomFact = false;
    let speechOutput = null;
    let randomFact = null;

    if ((typeof intent !== 'undefined') &&
        (typeof intent.slots !== 'undefined')&&
        (typeof intent.slots.FACT_YEAR !== 'undefined')) {
          const year = handlerInput.requestEnvelope.request.intent.slots.FACT_YEAR.value
          const yearFacts = searchYearFact(facts, year)
          if (yearFacts.length > 0) {
            randomFact = randomPhrase(yearFacts);
            speechOutput =  randomFact;
          } else {
            returnRandomFact = true;
          }
    } else {
      returnRandomFact = true
    }

    if (returnRandomFact) {
      randomFact = randomPhrase(facts);
      speechOutput = randomFact;
    }

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

const searchYearFact = (facts, year) => {
  let yearsArr = [];
  for (var i = 0; i < facts.length; i++) {
      var yearFound = grepFourDigitNumber(facts[i], year);
      if (yearFound != null) {
          yearsArr.push(yearFound)
      }
  };
  return yearsArr
};
const grepFourDigitNumber = (myString, year) => {
  const txt = new RegExp(year);
    if (txt.test(myString)) {
        return myString;
    } else {
        return null
    }
};
const randomPhrase = (phraseArr) => {
    var i = 0;
    i = Math.floor(Math.random() * phraseArr.length);
    return (phraseArr[i]);
};



const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'History Facts';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a history fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';


const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    // TODO: Add the handler you create above to this list of handlers
    GetNewYearFactHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

exports.facts = facts
