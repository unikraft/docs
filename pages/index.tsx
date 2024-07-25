import * as React from 'react'
import { Footer } from 'components/footer'
import LandingHero from 'components/landing-hero'
import { UnikraftCloudStrip } from 'components/landing/unikraft-cloud-strip'
import { BlueprintStrip } from 'components/landing/blueprint-strip'
import { KraftKitStrip } from 'components/landing/kraftkit-strip'
import { CatalogStrip } from 'components/landing/catalog-strip'
import { ResearchStrip } from 'components/landing/research-strip'
import { GreenStrip } from 'components/landing/green-strip'
import Header from 'components/header'
import SEO from 'components/seo'
import { t } from 'utils/i18n'

const HomePage = () => {
  return (
    <>
      <SEO
        title={t('homepage.seo.title')}
        description={t('homepage.seo.description')}
      />
      <Header />
      <LandingHero />
      <UnikraftCloudStrip />
      <CatalogStrip />
      <BlueprintStrip />
      <KraftKitStrip />
      <GreenStrip />
      <ResearchStrip />
      <Footer />
    </>
  )
}

export default HomePage
