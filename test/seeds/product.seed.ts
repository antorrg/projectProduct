import { Product, Item, startUp, closeDatabase } from '../../src/Configs/database.js'

const productsData = [
    {
        title: 'Producto Premium 1',
        picture: 'https://via.placeholder.com/150',
        logo: 'https://via.placeholder.com/50',
        info_header: 'Cabecera del Producto 1',
        info_body: 'Descripción detallada del producto premium número 1.',
        url: 'https://producto1.com',
        items: [
            {
                title: 'Característica A',
                text: 'Detalle de la característica A',
                picture: 'https://via.placeholder.com/100'
            },
            {
                title: 'Característica B',
                text: 'Detalle de la característica B',
                picture: 'https://via.placeholder.com/100'
            }
        ]
    },
    {
        title: 'Producto Estándar 2',
        picture: 'https://via.placeholder.com/150',
        logo: 'https://via.placeholder.com/50',
        info_header: 'Cabecera del Producto 2',
        info_body: 'Descripción del producto estándar número 2.',
        url: 'https://producto2.com',
        items: [
            {
                title: 'Funcionalidad X',
                text: 'Explicación de la funcionalidad X',
                picture: 'https://via.placeholder.com/100'
            },
            {
                title: 'Funcionalidad Y',
                text: 'Explicación de la funcionalidad Y',
                picture: 'https://via.placeholder.com/100'
            }
        ]
    }
]

const seed = async () => {
    try {
        console.log('🌱 Iniciando seed...')
        // Conectar a la DB (false, false para no borrar todo si no se quiere, o true, true para resetear)
        // Usaremos true, false para sincronizar modelos pero no borrar datos existentes necesariamente,
        // aunque para un seed limpio suele ser mejor limpiar antes.
        // Vamos a asumir que queremos añadir datos.
        await startUp(true, false)

        for (const pData of productsData) {
            const { items, ...productInfo } = pData
            const product = await Product.create(productInfo as any) as any
            console.log(`✅ Producto creado: ${product.title} (ID: ${product.id})`)

            for (const item of items) {
                await Item.create({
                    ...item,
                    ProductId: product.id
                })
                console.log(`   -> Item creado: ${item.title}`)
            }
        }

        console.log('✨ Seed completado exitosamente.')
    } catch (error) {
        console.error('❌ Error durante el seed:', error)
    } finally {
        await closeDatabase()   
    }
}

seed()
