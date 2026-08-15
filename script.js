const inputCurrencyElement = document.querySelector(".currency-value")
const currencySelectOriginal = document.querySelector(".converter-original")
const currencySelectConverter = document.querySelector(".currency-converter")
const convertButton = document.querySelector(".convert-button")
const resultValue = document.querySelector("#result-value")
const valueCurrencyToday = document.getElementById("result-converter")


let rates = {}

convertButton.disabled = true


async function getExchangeRates() {
    try {
        const response = await fetch("https://open.er-api.com/v6/latest/BRL")
        if (!response.ok) {
            throw new Error("Erro ao buscar as cotações")
        }
        const data = await response.json()

        rates = data.rates

        convertButton.disabled = false
    } catch (error) {
        console.error(error)
        resultValue.innerHTML = "Erro ao carregar cotações"
    }
}
resultValue.innerHTML = "Carregando..."
getExchangeRates()

function currencyConverter() {
    const valueConverter = Number(inputCurrencyElement.value)
    const originalCurrency = currencySelectOriginal.value
    const targetCurrency = currencySelectConverter.value

    const valueInBr = valueConverter / rates[originalCurrency]
    const convertedValue = valueInBr * rates[targetCurrency]

    resultValue.innerHTML = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: targetCurrency
    }).format(convertedValue)

    const rate = rates[targetCurrency] / rates[originalCurrency]
    let decimalPlaces
    if (rate < 0.01) {
        decimalPlaces = 5
    } else {
        decimalPlaces = 2
    }
    valueCurrencyToday.innerHTML = `${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: originalCurrency
    }).format(1)}= ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: targetCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: decimalPlaces
    }).format(rate)}`
}

convertButton.addEventListener("click", currencyConverter)
