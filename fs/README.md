# Full stack project
`clone project`
 
`be :`
```
git clone --filter=blob:none --no-checkout https://github.com/capstone-dicoding-proyek/MoneyLens.git

cd MoneyLens

git sparse-checkout init --cone

git sparse-checkout set be
```

`fe :`

```
git clone --filter=blob:none --no-checkout https://github.com/capstone-dicoding-proyek/MoneyLens.git

cd MoneyLens

git sparse-checkout init --cone

git sparse-checkout set fe
```

## Init project

```
npm install
```

## Fix style code

```
npm run lint-fix
```