## kalpa rules
1. kalpa module will npm module written in specific way.
2. This will help in naming the kalpa module, as npm takes care of naming in a unique way.
3. kalpa module is similar to anisible module.
4. kalpa will have the inbuilt keywords that are reserved, which means you cannot keep any kalpa module name by the inbuilt keywords name (ex name,result,when,)
During pharsing kalpa exludes the inbuilt keyword and look for kalpa installed or if can be installed


### Preplay module
preplay module is a module in kalpa echosystem which comes in to picture even before kalpa play starts. These module are usaually that template engines that renders the play book

```
kalpa-ejs:
      vars:
       - name: obj
         ref: properties
         file: values.yml
         directory: .

      kalpa:
        - name: job 1
          kalpa-module:
            param: <% obj.A %>
```

