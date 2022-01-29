
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Card, ResourceList, Stack, Layout, Page, Button } from '@shopify/polaris';


const CREATE_SCRIPT_TAG = gql`
    mutation scriptTagCreate ($input: ScriptTagInput!) {
        scriptTagCreate(input: $input) {
            scriptTag {
                id
            }
            userErrors {
                field
                message
            }
        }
    }
`;


const QUERY_SCRIPT_TAGS = gql`
    query {
        scriptTags(first: 5) {
            edges {
                node {
                    id
                    src
                    displayScope
                }
            }
        }
    }
`;

const DELETE_SCRIPT_TAG = gql`
    mutation scriptTagDelete($id: ID!) {
        scriptTagDelete(id: $id) {
            deletedScriptTagId
            userErrors {
                field
                message
            }
        }
    }
`;

function ScriptPage() {

    const [createScripts] = useMutation(CREATE_SCRIPT_TAG);
    const [deleteScripts] = useMutation(DELETE_SCRIPT_TAG);


    const {loading, error, data} = useQuery(QUERY_SCRIPT_TAGS);

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>

    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <Card title="These are the Script Tags" sectioned>
                        <p>Create or Delete a Script Tag</p>
                    </Card>
                </Layout.Section>
                <Layout.Section secondary>
                    <Card title="Create Tag" sectioned>
                        <Button
                            primary
                            size="slim"
                            type="submit"
                            onClick={() => {
                                createScripts({
                                    variables: {
                                        input: {
                                            src: "https://4a01-99-234-151-87.ngrok.io/test-script.js",
                                            displayScope: "ALL"
                                        }
                                    },
                                    refetchQueries: [{ query: QUERY_SCRIPT_TAGS }]
                                })
                            }}
                        
                        >Create Script Tag</Button>
                    </Card>
                </Layout.Section>
                <Layout.Section>
                    <Card>
                        <ResourceList
                            showHeader
                            resourceName={{ singular: 'Script', plural: 'Scripts' }}
                            items={data.scriptTags.edges}
                            renderItem={item => {
                                return (
                                    <ResourceList.Item
                                        id={item.id}
                                    >
                                        <Stack>
                                            <Stack.Item>
                                                <p>
                                                    {item.node.id}
                                                </p>
                                            </Stack.Item>
                                            <Stack.Item>
                                                <Button type="submit" onClick={() => {
                                                    deleteScripts({
                                                        variables: {
                                                            id: item.node.id,
                                                        },
                                                        refetchQueries: [{ query: QUERY_SCRIPT_TAGS }]
                                                    })
                                                }}>
                                                    Delete Script Tag
                                                </Button>
                                            </Stack.Item>
                                        </Stack>
                                    </ResourceList.Item>
                                )
                            }}
                        
                        />
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    )
}


export default ScriptPage;