# set -e tells bash that it should exit the script if any statement returns a non-true return value.
set -e
echo "Enter release version: "
read VERSION

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line

if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."
  npm test
  VERSION=$VERSION npm run build

  git add -A
  git commit -m "[build] $VERSION"
  npm login
  npm version $VERSION --message "[release] $VERSION"

  # publish
  git push origin refs/tags/v$VERSION
  git push
  npm publish
  npm logout
fi
