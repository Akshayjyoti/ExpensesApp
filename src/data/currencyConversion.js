function currencyConversion(currency) {
    switch(currency){
        case 'INR': return 1.00;

        case 'USD': return 82.52;

        case 'SGD': return 62.02;

        case 'MYR': return 19.05;
        
        default: return 1.00;
    }
}

export default currencyConversion;