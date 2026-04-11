#clone project
`be :`
```
git clone --filter=blob:none --no-checkout https://github.com/capstone-dicoding-proyek/MoneyLens.git

cd MoneyLens

git sparse-checkout init --cone

git sparse-checkout set ds

git checkout main
```
