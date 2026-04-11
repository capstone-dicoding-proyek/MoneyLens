# Full stack project
`clone project`
 
`be :`
```
git clone --filter=blob:none --no-checkout https://github.com/capstone-dicoding-proyek/MoneyLens.git

cd MoneyLens

git sparse-checkout init --cone

git sparse-checkout set fs/be

git checkout main
```

`fe :`

```
git clone --filter=blob:none --no-checkout https://github.com/capstone-dicoding-proyek/MoneyLens.git

cd MoneyLens

git sparse-checkout init --cone

git sparse-checkout set fs/fe

git checkout main

```
`fe and be`
```
git clone --filter=blob:none --no-checkout https://github.com/capstone-dicoding-proyek/MoneyLens.git

cd MoneyLens

git sparse-checkout init --cone

git sparse-checkout set fs/fe fs/be

git checkout main
```

## Init project

```
npm install
```

## Fix style code

```
npm run lint-fix
```
