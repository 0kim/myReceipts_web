DEPLOY_TARGET=(
    "src/css"
    "src/js"
    "src/index.html"
)

# Clean dist directory
echo "cleaning target directory..."
rm -rf ./target/*

# Deploy code
echo "deploying targets to target directory..."
for v in ${DEPLOY_TARGET[@]}
do
    cp -r $v target
done

# Find and replace environment variable
echo "updating relevant variables...."
applied_files=("target/js/myReceipts.js")
SED_PARAMS=(
    "s\`{{AWS_REGION}}\`$AWS_REGION\`g"
    "s\`{{AWS_COGNITO_USER_POOL_ID}}\`$AWS_COGNITO_USER_POOL_ID\`g"
    "s\`{{AWS_COGNITO_CLIENT_ID}}\`$AWS_COGNITO_CLIENT_ID\`g"
    "s\`{{MY_RECEIPTS_SERVICE_URL}}\`$MY_RECEIPTS_SERVICE_URL\`g"
)
for v in "${applied_files[@]}"; do
    for w in "${SED_PARAMS[@]}"; do
        echo "sed -i -e $w $v"
        sed -i -e $w $v
    done
done

# Delete redundant files
# rm dist/js/*.js-e

# Compress
# cd dist; zip -r remo_for_pooq_$VERSION.zip ${DEPLOY_TARGET[@]}

