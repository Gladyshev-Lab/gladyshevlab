import React from 'react'
import Card from '../components/Card'
import CardTitle from '../components/CardTitle'

const LabToolsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 ">Tools</h1>

      <Card>
        <CardTitle>
          <a href="http://clockbase.gladyshevlab.org" className='text-blue-500 hover:underline'>ClockBase</a>
        </CardTitle>
        <p>
          Accessible, interactive, and integrative platform for biological age computation from high-dimensional molecular data. ClockBase functions as an ensemble framework enabling biological age predictions across several clocks and species, with helpful visualization functionalities. Currently the ClockBase has the biological age of ~300k samples from GEO available.
        </p>
        <img src='/clockbase-logo-white.png' alt='clockbase-logo-white.png' className='w-70 h-40 mx-auto mb-4' />
      </Card>

      <Card>
        <CardTitle>
          <a href="http://gladyshevlab.org:3838/Gentervention/" className='text-blue-500 hover:underline'>GENtervention</a>
        </CardTitle>
        <p>Online portal to explore gene expression changes associated with lifespan-extending interventions.</p>
      </Card>

      <Card>
        <CardTitle>
          <a href="http://gladyshevlab.org/SelenoproteinPredictionServer/" className='text-blue-500 hover:underline'>SECISearch3 and Seblastian</a>
        </CardTitle>
        <p>A publicly accessible tool to predict eukaryotic selenoproteins and SECIS elements along nucleotide sequences.</p>
      </Card>

      <Card>
        <CardTitle>
          <a href="http://gladyshevlab.org:3838/mSALT/" className='text-blue-500 hover:underline'>mSALT</a>
        </CardTitle>
        <p>mSALT is an interactive database that consolidates a comprehensive collection of mammalian gene expression signatures associated with aging and longevity. Through an integrative meta-analysis of more than 100 independent datasets, mSALT reveals associations of gene expression with (i) aging across various tissues and species; (ii) lifespan extension achieved through genetic, dietary, and pharmacological interventions in mice; and (iii) longevity traits more than 40 mammalian species.</p>
      </Card>
    </div>
  )
}

export default LabToolsPage