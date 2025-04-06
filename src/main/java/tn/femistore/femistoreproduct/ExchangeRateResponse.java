package tn.femistore.femistoreproduct;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class ExchangeRateResponse {
    @JsonProperty("result")
    private String result;

    @JsonProperty("base_code")
    private String baseCode;

    @JsonProperty("conversion_rates")
    private Map<String, Double> conversionRates;

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getBaseCode() {
        return baseCode;
    }

    public void setBaseCode(String baseCode) {
        this.baseCode = baseCode;
    }

    public Map<String, Double> getConversionRates() {
        return conversionRates;
    }

    public void setConversionRates(Map<String, Double> conversionRates) {
        this.conversionRates = conversionRates;
    }

    @Override
    public String toString() {
        return "ExchangeRateResponse{" +
                "result='" + result + '\'' +
                ", baseCode='" + baseCode + '\'' +
                ", conversionRates=" + conversionRates +
                '}';
    }
}