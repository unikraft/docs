import {
  Heading,
  SimpleGrid,
  Text,
  Link,
  Tag,
  Card,
  CardHeader,
} from '@chakra-ui/react'
import fs from 'fs'
import MDXLayout from 'layouts/mdx'
import { Paper as IPaper } from 'src/types/paper'
import { t } from 'utils/i18n'
import { load } from "js-yaml";

function Paper(props: { paper: IPaper }) {
  const {
    title,
    venue,
    year,
    url,
    pdf,
    slides,
    video,
    authors,
  } = props.paper

  return (
    <Card
      position='relative'
      justify='space-between'
      border='1px'
      shadow='none'
      borderColor='slate.200'
      _dark={{
        borderColor: 'slate.700'
      }}
      transform='auto'
      transition='all 0.1s ease-in-out'
      _hover={{ textDecoration: 'none', translateY: '-2px', shadow: 'md' }}
    >
      <CardHeader>
        <Tag size='sm'>{venue}</Tag>
        <Heading size='sm' my='1'><Link href={pdf}>{title}</Link></Heading>
        <Text><span>by</span> {authors.join(', ')}</Text>
      </CardHeader>
    </Card>
  )
}

interface PaperProps {
  papers: IPaper[]
}

function Papers({ papers }: PaperProps) {
  return (
    <MDXLayout
      hideToc={true}
      maxWidth={'100%'}
      frontmatter={{
        title: t('papers.seo.title'),
        description: t('papers.seo.description'),
        slug: '/community/papers',
      }}
    >
      <Text lineHeight='tall' mt='5'>
        {t('papers.message')}
      </Text>

      <SimpleGrid columns={1} spacing='20px' pt='8'>
        {papers.map((paper, i) => (
          <Paper key={i} paper={paper} />
        ))}
      </SimpleGrid>

    </MDXLayout>
  )
}

export async function getStaticProps() {
  /**
   * Read metadata for each talk from `data/papers.yaml`.
   */
  const papers = load(fs.readFileSync('data/papers.yaml', 'utf-8'));

  return {
    props: {
      papers
    },
  }
}

export default Papers
