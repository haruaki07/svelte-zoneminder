const decode = require("jwt-decode");

console.log(
  decode(
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJab25lTWluZGVyIiwiaWF0IjoxNjEwMDIxNDI1LCJleHAiOjE2MTAxMDc4MjUsInVzZXIiOiJhZG1pbiIsInR5cGUiOiJyZWZyZXNoIn0.gotmXZowxj6QqhTfn7fe2MvN8ejQfXCj0xnaxjZheEk"
  )
);
